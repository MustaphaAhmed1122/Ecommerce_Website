import UserModel from "../../DB/Model/User.model.js";
import { asyncHandle } from "../Utils/ErrorHandelr.js";
import { verifyToken } from "../Utils/GenerateAndVerifyToken.js";

export const Roles = {
  Admin: "Admin",
  User: "User",
  HR: "HR",
};

export const auth = (accessRole = []) => {
  return asyncHandle(async (req, res, next) => {
    const { authentication } = req.headers;

    if (!authentication?.startsWith(process.env.Bearer_Token)) {
      return next(new Error("In_Valid Bearer key", { cause: 409 }));
    }
    const token = authentication.split(process.env.Bearer_Token)[1];
    if (!token) {
      return next(new Error("IN_Valid authentication", { cause: 400 }));
    }

    const decoded = verifyToken({ token });
    if (!decoded?.id) {
      return next(new Error("IN_Valid TokenPayload", { cause: 400 }));
    }
    const user = await UserModel.findById(decoded.id).select(
      "username role email passwordChangeTime"
    );

    if (parseInt(user.passwordChangeTime?.getTime() / 1000) > decoded.iat) {
      return next(new Error("Expired Token", { cause: 400 }));
    }
    if (!user) {
      return next(new Error("Not Register User", { cause: 400 }));
    }

    if (!accessRole.includes(user.role)) {
      return next(new Error("Not Authorized User", { cause: 403 }));
    }

    req.user = user;
    return next();
  });
};
