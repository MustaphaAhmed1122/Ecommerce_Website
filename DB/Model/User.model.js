import mongoose, { Types, model } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "UserName is Required"],
      min: [2, "minmum length 2 char"],
      max: [20, "max length 20 char"],
    },
    email: {
      type: String,
      required: [true, "email is Required"],
      unique: [true, "email is duplicated"],
    },
    password: {
      type: String,
      required: [true, "email is Required"],
    },
    phone: {
      type: String,
      unique: [true, "phone is duplicated"],
    },
    DOB: String,
    address: {
      type: String,
      //   required: [true, "address is Required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
    Status: {
      type: String,
      default: "Offline",
      enum: ["Offline", "Online"],
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    Image: Object,
    forgetCode: { type: Number, default: null },
    passwordChangeTime: { type: Date },
    wishlist: { type: [{ type: Types.ObjectId, ref: "Product" }] },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || model("User", UserSchema);
export default UserModel;
