import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const create = joi
  .object({
    name: joi.string().min(2).max(20).required(),
    file: generalFields.file,
  })
  .required();

export const update = joi
  .object({
    BrandID: generalFields.id,
    name: joi.string().min(2).max(20).required(),
    file: generalFields.file,
  })
  .required();
