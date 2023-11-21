import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const create = joi
  .object({
    name: joi.string().min(3).max(20).required(),
    file: generalFields.file.required(),
  })
  .required();

export const update = joi
  .object({
    categoryID: generalFields.id,
    name: joi.string().min(3).max(20),
    file: generalFields.file,
  })
  .required();
