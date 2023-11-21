import mongoose, { Schema, Types, model } from "mongoose";

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      requied: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    image: { type: Object },
    amount: { type: Number, default: 1 },
    expireDate: { type: Date, requied: true },
    UserBY: [{ type: Types.ObjectId, ref: "User" }],
    createdBY: { type: Types.ObjectId, ref: "User", requied: true },
    UpdatedBY: { type: Types.ObjectId, ref: "User", requied: false },
  },
  {
    timestamps: true,
  }
);

//meaning if not create model created forced
const CouponModel = mongoose.models.Coupon || model("Coupon", CouponSchema);
export default CouponModel;
