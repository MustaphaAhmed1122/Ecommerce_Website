import mongoose, { Types, model } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    UserID: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    products: [
      {
        productID: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.models.Cart || model("Cart", CartSchema);
export default CartModel;
