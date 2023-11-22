import UserRouter from "./user/user.router.js";
import AuthRouter from "./auth/auth.router.js";
import BrandRouter from "./brand/brand.router.js";
import CardtRouter from "./cart/cart.router.js";
import SubcategoryRouter from "./subcategory/subcategory.router.js";
import CouponRouter from "./coupon/coupon.router.js";
import ProductRouter from "./product/product.router.js";
import ReviewRouter from "./Reviews/reviews.router.js";
import OrderRouter from "./order/order.router.js";
import CategoryRouter from "./category/category.router.js";
import connDB from "../../DB/Connection.js";
import { globalErrorHandler } from "../Utils/ErrorHandelr.js";
import morgan from "morgan";
import cors from "cors";
//------This in case we used local Storge-------------------
// import path from "path";
// import { fileURLToPath } from "url";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initapp = (app, express) => {
  //__________________CORS Middleware_____________________F
  // var whitelist = ["http://localhost:5000/"];
  // app.use(async (req, res, next) => {
  //   // if (!whitelist.includes(req.header("Origin"))) {
  //   //   return next(new Error("Not Allowed By CORS", { status: 403 }));
  //   // }
  //   // for (const orgin of whitelist) {
  //   //   if (req.header("Origin") == orgin) {
  //   //     await res.header("Access-Control-Allow-Origin", orgin);
  //   //     break;
  //   //   }
  //   // }
  //   await res.header("Access-Control-Allow-Origin", whitelist);
  //   await res.header("Access-Control-Allow-Headers", "*");
  //   await res.header("Access-Control-Allow-Private-Network", "true");
  //   await res.header("Access-Control-Allow-Methods", "*");
  //   next();
  // });
  app.use(cors({}));

  if (process.env.MOOD == "DEV") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }
  //Buffer DATA
  app.use(express.json({}));
  //APP ROUTING
  app.get(`/`, (req, res) => {
    return res.status(200).json({ message: "welcome home" });
  });
  app.use(`/user`, UserRouter);
  app.use(`/Auth`, AuthRouter);
  app.use(`/brand`, BrandRouter);
  app.use(`/cart`, CardtRouter);
  app.use(`/subcategory`, SubcategoryRouter);
  app.use(`/coupon`, CouponRouter);
  app.use(`/product`, ProductRouter);
  app.use(`/review`, ReviewRouter);
  app.use(`/order`, OrderRouter);
  app.use(`/category`, CategoryRouter);

  app.all("*", (req, res, next) => {
    return res.status(404).json({ message: "PAGE NOT FOUND" });
  });
  //   Global Handel Error
  app.use(globalErrorHandler);
  connDB();
};

export default initapp;
