import { Roles } from "../../Middleware/auth.js";

export const endPoint = {
  create: [Roles.User, Roles.Admin],
  delete: [Roles.User, Roles.Admin],
};
