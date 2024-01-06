import { Router } from "express";
const router = Router();
import express from "express";
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

const endpointSecret =
  "whsec_77b67dbe9cc80203e8ad187f05e1a6162498ee55fe570830d66f9892320fc8f3";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  OrderController.webhook
);

export default router;
