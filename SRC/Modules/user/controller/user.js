import UserModel from "../../../../DB/Model/User.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";


export const GetAll = asyncHandle(async (req, res, next) => {
  const user = await UserModel.find().select("username email role");
  if (!user) {
    return next(new Error("No Data", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", user });
});

