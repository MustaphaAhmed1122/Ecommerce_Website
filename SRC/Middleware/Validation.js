import joi from "joi";
import { Types } from "mongoose";

const customValidation = (value, helper) => {
  return Types.ObjectId.isValid(value) ? true : helper.error("IN_Valid");
};

export const generalFields = {
  headers: joi.string().required(),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    ),

  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 3,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({
      "string.email": "Wrong Email Type",
    }),

  cPaswword: joi.string().required().messages({
    "any.only": "password mismatch",
  }),

  newPaswword: joi
    .string()
    .invalid(joi.ref("oldPassword"))
    .pattern(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    )
    .required()
    .messages({
      "any.invalid": "you cannot repeat old password",
    }),

  phone: joi
    .string()
    .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
    .required(),

  id: joi.string().custom(customValidation).required(),
  CustomID: joi.string().custom(customValidation),

  file: joi.object({
    size: joi.number().positive().required(),
    path: joi.string().required(),
    filename: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    fieldname: joi.string().required(),
    dest: joi.string(),
  }),
};

export const validtion = (Schema, considerHeaders = false) => {
  return (req, res, next) => {
    let inputData = { ...req.body, ...req.quey, ...req.params };
    if (req.file || req.files) {
      inputData.file = req.file || req.files;
    }

    if (req.headers.authentication && considerHeaders) {
      inputData = { authentication: req.headers.authentication };
    }

    const validationResult = Schema.validate(inputData, { abortEarly: false });
    if (validationResult.error?.details) {
      return res.status(400).json({
        messages: "Validation Error",
        ValidationErr: validationResult.error?.details,
      });
    }
    return next();
  };
};
