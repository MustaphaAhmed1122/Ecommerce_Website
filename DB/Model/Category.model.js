import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, requied: true, unique: true, lowercase: true},
    slug: { type: String, requied: true , lowercase: true},
    image: { type: Object, required: true },
    createdBY: { type: Types.ObjectId, ref: "User", requied: true },
    UpdatedBy: { type: Types.ObjectId, ref: "User", requied: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

categorySchema.virtual("SubCategory", {
  localField: "_id",
  foreignField: "CategoryID",
  ref: "SubCategory",
});

//meaning if not create model created forced
const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
