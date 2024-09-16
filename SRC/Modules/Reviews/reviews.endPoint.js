import { Roles } from "../../Middleware/auth.js";

export const endPoint = {
  create: [Roles.User],
  update: [Roles.User],
};
