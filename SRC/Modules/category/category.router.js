import { Router } from "express";
const router = Router();
import * as CategoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../Utils/cloudMulter.js";
import * as ValidationSchema from "./category.validation.js";
import { validtion } from "../../Middleware/Validation.js";
import SubCategory from "../subcategory/subcategory.router.js";
import { Roles, auth } from "../../Middleware/auth.js";
import { endPoint } from "./category.endPoint.js";

router.use(`/:CategoryID/subcategory`, SubCategory);

router.post(
  `/createCategory`,
  auth(endPoint.create),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.create),
  CategoryController.createCategory
);

router.put(
  `/updateCategory/:categoryID`,
  auth(endPoint.update),
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.update),
  CategoryController.updateCatogry
);

// router.get(`/`, auth(Object.values(Roles)), CategoryController.allcategory);
router.get(`/`, CategoryController.allcategory);

export default router;
