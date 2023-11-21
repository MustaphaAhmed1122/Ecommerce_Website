import mongoose, { Types, model } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    UserID: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    UpdatedBy: { type: Types.ObjectId, ref: "User" },

    name: { type: String, required: true, lowercase: true },
    address: { type: String, required: true },
    phone: [{ type: String, required: true }],
    note: String,

    products: [
      {
        productID: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalprice: { type: Number, default: 1, required: true },
      },
    ],

    copoupID: { type: Types.ObjectId, ref: "Coupon" },
    subtotal: { type: Number, default: 1, required: true },
    total: { type: Number, default: 1, required: true },
    paymentType: { type: String, default: "cash", enum: ["cash", "card"] },
    orderStatus: {
      type: String,
      default: "placed",
      enum: [
        "placed",
        "waitpayment",
        "canceld",
        "rejected",
        "deliverd",
        "onway",
      ],
    },
    reason: String,
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.models.Order || model("Order", OrderSchema);
export default OrderModel;
