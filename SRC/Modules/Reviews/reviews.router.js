import { auth } from "../../Middleware/auth.js";
import { endPoint } from "./reviews.endPoint.js";
import { Router } from "express";
const router = Router({ mergeParams: true });
import * as ReviewController from "./controller/reviews.js";
import { validtion } from "../../Middleware/Validation.js";
import * as ValidationSchema from "./reviews.validation.js";

router.post(
  `/Addreview`,
  auth(endPoint.create),
  validtion(ValidationSchema.create),
  ReviewController.AddReviews
);

router.put(
  `/Updatereview/:ReviewID`,
  auth(endPoint.update),
  validtion(ValidationSchema.Update),
  ReviewController.UpdateReviews
);

export default router;
