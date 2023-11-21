import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const headers = joi
  .object({
    authentication: generalFields.headers,
  })
  .required();

export const create = joi
  .object({
    name: joi.string().min(3).max(20).required(),
    description: joi.string().min(3).max(15000),
    stock: joi.number().integer().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(1),
    size: joi.array(),
    color: joi.array(),

    CategoryID: generalFields.id,
    SubCategoryId: generalFields.id,
    BrandId: generalFields.id,
    file: joi
      .object({
        Mainimage: joi
          .array()
          .items(generalFields.file.required())
          .length(1)
          .required(),
        SubImages: joi.array().items(generalFields.file).min(1).max(5),
      })
      .required(),
  })
  .required();

export const update = joi
  .object({
    name: joi.string().min(3).max(20),
    description: joi.string().min(3).max(15000),
    stock: joi.number().integer().positive().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(1),
    size: joi.array(),
    color: joi.array(),

    productID: generalFields.id,
    CategoryID: generalFields.CustomID,
    SubCategoryId: generalFields.CustomID,
    BrandId: generalFields.CustomID,
    file: joi
      .object({
        Mainimage: joi.array().items(generalFields.file.required()).max(1),
        SubImages: joi.array().items(generalFields.file).min(1).max(5),
      })
      .required(),
  })
  .required();

export const wishlist = joi
  .object({
    productID: generalFields.id,
  })
  .required();
