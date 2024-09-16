import { Roles } from "../../Middleware/auth.js";

export const endPoint = {
  create: [Roles.User, Roles.Admin],
  cancle: [Roles.User],
  cancleorderByAdmin: [Roles.Admin],
};
