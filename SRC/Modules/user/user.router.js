import { Router } from "express";
const router = Router();
import * as UserController from "./controller/user.js";
import { Roles, auth } from "../../Middleware/auth.js";
import { endPoint } from "./user.endPoint.js";

router.get(`/`, auth(endPoint.showall), UserController.GetAll);


export default router;
