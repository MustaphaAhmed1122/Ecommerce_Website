import { Router } from "express";
import * as CartController from "./controller/cart.js";
import { validtion } from "../../Middleware/Validation.js";
import * as ValidationSchema from "./cart.validation.js";
import { auth } from "../../Middleware/auth.js";
import { endPoint } from "./cart.endPoint.js";
const router = Router();

router.post(
  `/addcart`,
  auth(endPoint.create),
  validtion(ValidationSchema.create),
  CartController.create
);

router.patch(`/deleteItem`, auth(endPoint.delete), CartController.deleteItem);

router.patch(`/clearItem`, auth(endPoint.delete), CartController.clearItem);

export default router;
