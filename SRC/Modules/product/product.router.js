import { Router } from "express";
const router = Router();
import * as ProductController from "./controller/product.js";
import { auth } from "../../Middleware/auth.js";
import { fileUpload, fileValidation } from "../../Utils/cloudMulter.js";
import * as ValidationSchema from "./product.validation.js";
import { validtion } from "../../Middleware/Validation.js";
import { endPoint } from "./product.endPoint.js";
import reviewRouter from "../Reviews/reviews.router.js";

router.use(`/:productID/review`, reviewRouter);

//_________________Add Product By Admin__________________
router.post(
  `/addproduct`,
  validtion(ValidationSchema.headers, true),
  auth(endPoint.create),
  fileUpload(fileValidation.image).fields([
    { name: "Mainimage", maxCount: 1 },
    { name: "SubImages", maxCount: 5 },
  ]),
  validtion(ValidationSchema.create),
  ProductController.addproduct
);

//_________________Update Product By Admin__________________
router.put(
  `/updateproduct/:productID`,
  auth(endPoint.update),
  fileUpload(fileValidation.image).fields([
    { name: "Mainimage", maxCount: 1 },
    { name: "SubImages", maxCount: 5 },
  ]),
  validtion(ValidationSchema.update),
  ProductController.updateproduct
);

router.patch(
  `/addproductwishlist/:productID`,
  auth(endPoint.wishlist),
  validtion(ValidationSchema.wishlist),
  ProductController.addTowishlist
);

router.patch(
  `/removeproductwishlist/:productID`,
  auth(endPoint.wishlist),
  validtion(ValidationSchema.wishlist),
  ProductController.removeTowishlist
);


router.get(`/productlist`, ProductController.allProduct);

export default router;
