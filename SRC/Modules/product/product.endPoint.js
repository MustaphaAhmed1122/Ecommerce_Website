import { Roles } from "../../Middleware/auth.js";

export const endPoint = {
  create: [Roles.Admin],
  update: [Roles.Admin],
  showall: [Roles.User, Roles.Admin],
  wishlist: [Roles.User],
};
