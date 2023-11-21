import UserModel from "../../../../DB/Model/User.model.js";
import { nanoid, customAlphabet } from "nanoid";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import {
  generateToken,
  verifyToken,
} from "../../../Utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../Utils/HashAndCompare.js";
import SendEmail from "../../../Utils/SendEmail.js";

export const signup = asyncHandle(async (req, res, next) => {
  const { username, password, email, phone } = req.body;

  if (await UserModel.findOne({ email })) {
    return next(new Error("User already exist", { cause: 409 }));
  }

  const token = generateToken({
    payload: { email },
    signature: process.env.Email_Token,
    expiresIn: 60 * 5,
  });
  const refreshtoken = generateToken({
    payload: { email },
    signature: process.env.Email_Token,
    expiresIn: 60 * 60 * 24 * 3,
  });

  const link = `${req.protocol}://${req.headers.host}/Auth/ConfirmEmail/${token}`;
  const refreshlink = `${req.protocol}://${req.headers.host}/Auth/refreshConfirmEmail/${refreshtoken}`;

  const html = `<a href="${link}">confirm</a>
                <br> <br>
                <a href="${refreshlink}">Request new Email</a>`;

  if (!(await SendEmail({ to: email, subject: "confirmation Email", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }

  const hashpassword = hash({ plaintext: password });

  const CreateUser = await UserModel.create({
    username,
    email,
    password: hashpassword,
    phone,
  });
  return res.status(201).json({ message: `welcome ${CreateUser.username}` });
});

export const confirmEmail = asyncHandle(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.Email_Token });
  if (!email) {
    return next(new Error("In_Valid Token", { cause: 400 }));
  }
  const user = await UserModel.findOneAndUpdate(
    { email },
    { confirmEmail: true },
    { new: true }
  );
  return res.json({ message: "Done", user });
});

export const refreshconfirmEmail = asyncHandle(async (req, res, next) => {
  const { token } = req.params;
  const { email } = verifyToken({ token, signature: process.env.Email_Token });
  if (!email) {
    return next(new Error("In_Valid Token", { cause: 400 }));
  }
  const user = await UserModel.findOne({ email });
  if (user.confirmEmail) {
    return res.json({ message: "Done", user });
  }

  const newtoken = generateToken({
    payload: { email },
    signature: process.env.Email_Token,
    expiresIn: 60 * 2,
  });

  const link = `${req.protocol}://${req.headers.host}/Auth/ConfirmEmail/${newtoken}`;
  const refreshlink = `${req.protocol}://${req.headers.host}/Auth/refreshConfirmEmail/${token}`;

  const html = `<a href="${link}">confirm</a>
                <br> <br>
                <a href="${refreshlink}">Request new Email</a>`;

  if (!(await SendEmail({ to: email, subject: "confirmation Email", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  return res
    .status(200)
    .send("<p>new confirmation send to you please chech you inbox</p>");
});

export const login = asyncHandle(async (req, res, next) => {
  const { password, email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return next(new Error("you have to signup", { cause: 404 }));
  }

  if (!user.confirmEmail) {
    return next(new Error("you have to confirm you Email", { cause: 400 }));
  }

  if (!compare({ plaintext: password, hashvalue: user.password })) {
    return next(new Error("In_Valid Password", { cause: 400 }));
  }

  const access_Token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 60 * 30,
  });

  const Refresh_Token = generateToken({
    payload: { id: user._id, role: user.role },
    expiresIn: 60 * 60 * 24 * 365,
  });
  user.Status = "Online";
  await user.save();
  return res
    .status(201)
    .json({ message: `Done `, access_Token, Refresh_Token });
});

export const SendCode = asyncHandle(async (req, res, next) => {
  const { email } = req.body;
  const NaoID = customAlphabet("123456789", 4);
  const forgetCode = NaoID();
  const user = await UserModel.findOneAndUpdate(
    { email },
    { forgetCode },
    { new: true }
  );
  if (!user) {
    return next(Error("Not Register Account", { cause: 404 }));
  }

  const html = `<p>${forgetCode} </br> RestCode</p>`;

  if (!(await SendEmail({ to: email, subject: "Sending RestCode", html }))) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }

  return res
    .status(201)
    .json({ message: "Sended Code", user: user.forgetCode });
});

export const ForgetPassword = asyncHandle(async (req, res, next) => {
  const { email, forgetCode, newpassword } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(Error("Not Register Account", { cause: 404 }));
  }

  if (user.forgetCode != forgetCode || !forgetCode) {
    return next(Error("IN_Valid restCode", { cause: 404 }));
  }

  user.password = hash({ plaintext: newpassword });
  //convert value to null to avoid haking or change password more than 1 time
  user.forgetCode = null;
  user.passwordChangeTime = Date.now();
  await user.save();

  return res
    .status(200)
    .json({ message: "Updated You password ,you can login now" });
});
