import { Router } from "express";
const router = Router();
import * as OrderController from "./controller/order.js";
import * as ValidationSchema from "./order.validation.js";
import { auth } from "../../Middleware/auth.js";
import { endPoint } from "./order.endPoint.js";
import { validtion } from "../../Middleware/Validation.js";

//___________________Create Order______________________
router.post(
  `/create`,
  auth(endPoint.create),
  validtion(ValidationSchema.createOrder),
  OrderController.create
);

//___________________cancelOrderByUser______________________
router.patch(
  `/cancleorder/:orderID`,
  auth(endPoint.cancle),
  validtion(ValidationSchema.cancleOrder),
  OrderController.cancelOrder
);

//___________________cancelOrderByAdmin______________________
router.patch(
  `/cancleorderByAdmin/:orderID/Admin`,
  auth(endPoint.cancleorderByAdmin),
  validtion(ValidationSchema.cancleorderByAdmin),
  OrderController.cancelOrderByAdmin
);

export default router;
