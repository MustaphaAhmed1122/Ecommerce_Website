import { Roles } from "../../Middleware/auth.js";

export const endPoint = {
  showall: [Roles.Admin],
};
