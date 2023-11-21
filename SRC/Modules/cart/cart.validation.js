import { generalFields } from "../../Middleware/Validation.js";
import joi from "joi";

export const create = joi
  .object({
    productID: generalFields.id,
    quantity: joi.number().min(1).max(500).positive().integer().required(),
  })
  .required();
