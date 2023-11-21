import { Router } from "express";
const router = Router({ mergeParams: true });
import * as subCategoryController from "./controller/subcategory.js";
import { fileUpload, fileValidation } from "../../Utils/cloudMulter.js";
import * as ValidationSchema from "./subcategory.validation.js";
import { validtion } from "../../Middleware/Validation.js";
import { Roles, auth } from "../../Middleware/auth.js";
import { endPoint } from "./subcategory.endPoint.js";

router.post(
  `/addsubcategory`,
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.create),
  subCategoryController.createsubcategory
);

router.put(
  `/updatesubCategory/:SubCategoryId`,
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.update),
  subCategoryController.updatesubcategory
);

router.get(`/`, subCategoryController.allsubcategory);

export default router;
