import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const create = joi
  .object({
    name: joi.string().min(3).max(20).required(),
    file: generalFields.file.required(),
    CategoryID: generalFields.id,
  })
  .required();

export const update = joi
  .object({
    CategoryID: generalFields.id,
    SubCategoryId: generalFields.id,
    name: joi.string().min(5).max(20),
    file: generalFields.file,
  })
  .required();
