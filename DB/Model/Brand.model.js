import mongoose, { Schema, Types, model } from "mongoose";

const BrandSchema = new Schema(
  {
    name: { type: String, requied: true, unique: true, lowercase: true },
    image: { type: Object, required: true },
    createdBY: { type: Types.ObjectId, ref: "User", requied: true },
    UpdatedBY: { type: Types.ObjectId, ref: "User", requied: false },
  },
  {
    timestamps: true,
  }
);

//meaning if not create model created forced
const BrandModel = mongoose.models.Brand || model("Brand", BrandSchema);
export default BrandModel;
