import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const create = joi
  .object({
    productID: generalFields.id,
    comment: joi.string().required().min(2).max(15000),
    rating: joi.number().positive().min(1).max(5),
  })
  .required();

export const Update = joi
  .object({
    productID: generalFields.id,
    ReviewID: generalFields.id,
    comment: joi.string().required().min(2).max(15000),
    rating: joi.number().positive().min(1).max(5),
  })
  .required();
