import mongoose, { Schema, Types, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    comment: { type: String, requied: true },
    rating: { type: Number, required: true, Min: 1, max: 5 },
    createdBY: { type: Types.ObjectId, ref: "User", requied: true },
    productID: { type: Types.ObjectId, ref: "Product", requied: true },
    orderID: { type: Types.ObjectId, ref: "Order", requied: true },
  },
  {
    timestamps: true,
  }
);

//meaning if not create model created forced
const ReviewModel = mongoose.models.Review || model("Review", ReviewSchema);
export default ReviewModel;
