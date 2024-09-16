import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const create = joi
  .object({
    name: joi.string().min(3).max(20).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expireDate: joi.date().greater(Date.now()).required(),
    file: generalFields.file,
  })
  .required();

export const update = joi
  .object({
    CopounID: generalFields.id,
    name: joi.string().min(3).max(20).required(),
    amount: joi.number().positive().min(1).max(100),
    expireDate: joi.date().greater(Date.now()).required(),
    file: generalFields.file,
  })
  .required();
