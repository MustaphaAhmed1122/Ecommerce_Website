import joi from "joi";
import { generalFields } from "../../Middleware/Validation.js";

export const createOrder = joi.object({
  name: joi.string().min(3).max(20),
  note: joi.string().min(1),
  address: joi.string().min(1).required(),
  phone: joi
    .array()
    .items(joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)))
    .min(1)
    .max(3)
    .required(),
  copounName: joi.string(),
  paymentType: joi.string().valid("cash", "card"),
  products: joi.array().items(
    joi
      .object({
        productID: generalFields.id,
        quantity: joi.number().integer().positive().min(1).required(),
      })
      .min(1)
      .max(3)
  ),
});

export const cancleOrder = joi.object({
  orderID: generalFields.id,
  reason: joi.string().min(3).required(),
});

export const cancleorderByAdmin = joi.object({
  orderID: generalFields.id,
  orderStatus: joi.string().valid("deliverd", "onway").required(),
});
