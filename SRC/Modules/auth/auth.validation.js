import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const Signup = joi
  .object({
    username: joi.string().min(2).max(20).required(),
    password: generalFields.password,
    cPaswword: generalFields.cPaswword.valid(joi.ref("password")),
    email: generalFields.email,
    file: generalFields.file,
    phone: generalFields.phone,
  })
  .required();

export const token = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const login = joi
  .object({
    password: generalFields.password,
    email: generalFields.email,
  })
  .required();

export const ForgetPassword = joi
  .object({
    newpassword: generalFields.password,
    cPaswword: generalFields.cPaswword.valid(joi.ref("newpassword")),
    email: generalFields.email,
    forgetCode: joi
      .string()
      .pattern(RegExp(/^[0-9]{4}$/))
      .required(),
  })
  .required();

export const SendCode = joi
  .object({
    email: generalFields.email,
  })
  .required();
