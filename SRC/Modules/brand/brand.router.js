import { Router } from "express";
const router = Router({ caseSensitive: true });
import * as Brandontroller from "./controller/brand.js";
import { fileUpload, fileValidation } from "../../Utils/cloudMulter.js";
import * as ValidationSchema from "./brand.validation.js";
import { validtion } from "../../Middleware/Validation.js";
import { Roles, auth } from "../../Middleware/auth.js";
import { endPoint } from "./brand.endPoint.js";

router.get(`/`, Brandontroller.allbrand);

router.post(
  `/addBrand`,
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.create),
  Brandontroller.CreateBrand
);

router.put(
  `/updatesBrand/:BrandID`,
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.update),
  Brandontroller.UpdateBrand
);

export default router;
