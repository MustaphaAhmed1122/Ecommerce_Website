import { Router } from "express";
const router = Router();
import * as authController from "./controller/auth.js";
import { fileUpload, fileValidation } from "../../Utils/cloudMulter.js";
import * as ValidationSchema from "./auth.validation.js";
import { validtion } from "../../Middleware/Validation.js";
import { Roles, auth } from "../../Middleware/auth.js";

//-____________SingUP_________________________
router.post(
  `/Signup`,
  fileUpload(fileValidation.image).single("Image"),
  validtion(ValidationSchema.Signup),
  authController.signup
);

router.post(`/login`, validtion(ValidationSchema.login), authController.login);

//_-----------------------ConfirmEmailLink-------------------
router.get(
  `/ConfirmEmail/:token`,
  validtion(ValidationSchema.token),
  authController.confirmEmail
);

//_-----------------------refreshConfirmEmailLink-------------------
router.get(
  `/refreshConfirmEmail/:token`,
  validtion(ValidationSchema.token),
  authController.refreshconfirmEmail
);

//_-----------------Sending RestCode----------------
router.patch(
  `/SendCode`,
  auth(Object.values(Roles)),
  validtion(ValidationSchema.SendCode),
  authController.SendCode
);

//_-----------------ForgetPassword RestCode----------------
router.patch(
  `/forgetpassword`,
  auth(Object.values(Roles)),
  validtion(ValidationSchema.ForgetPassword),
  authController.ForgetPassword
);

export default router;
