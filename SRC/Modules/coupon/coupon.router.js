import { Router } from "express";
const router = Router();
import * as CopounController from "./controller/coupon.js";
import { fileUpload, fileValidation } from "../../Utils/cloudMulter.js";
import * as ValidationSchema from "./coupon.validation.js";
import { validtion } from "../../Middleware/Validation.js";
import { Roles, auth } from "../../Middleware/auth.js";
import { endPoint } from "./coupon.endPoint.js";

router.get(`/`, auth(Object.values(Roles)), CopounController.allcopoun);

router.post(
  `/addCopoun`,
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.create),
  CopounController.CreateCopoun
);

router.put(
  `/updatesubCategory/:CopounID`,
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.update),
  CopounController.UpdateCopoun
);

export default router;
