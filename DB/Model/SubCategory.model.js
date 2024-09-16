import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: { type: String, requied: true, unique: true, lowercase: true },
    slug: { type: String, requied: true, lowercase: true },
    image: { type: Object, required: true },
    CategoryID: { type: Types.ObjectId, ref: "Category", requied: true },
    createdBY: { type: Types.ObjectId, ref: "User", requied: true },
    UpdatedBY: { type: Types.ObjectId, ref: "User", requied: false },
    customID: { type: String, requied: true, unique: true },
  },
  {
    timestamps: true,
  }
);
//meaning if not create model created forced
const SubCategoryModel =
  mongoose.models.SubCategory || model("SubCategory", subCategorySchema);
export default SubCategoryModel;
