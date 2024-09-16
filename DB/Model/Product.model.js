import mongoose, { Schema, Types, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, requied: true, trim: true, lowercase: true },
    slug: { type: String, requied: true, trim: true, lowercase: true },
    description: String,
    stock: { type: Number, default: 1, required: true },
    price: { type: Number, default: 1, required: true },
    discount: { type: Number, default: 0 },
    finalprice: { type: Number, default: 1, required: true },
    color: [String],
    size: { type: [String], enum: ["S", "L", "M", "XL", "XXl"] },
    Mainimage: { type: Object, required: true },
    SubImages: { type: [Object] },

    CategoryID: { type: Types.ObjectId, ref: "Category", requied: true },
    SubCategoryId: { type: Types.ObjectId, ref: "SubCategory", requied: true },
    BrandId: { type: Types.ObjectId, ref: "Brand", requied: true },

    createdBY: { type: Types.ObjectId, ref: "User", requied: true },
    UpdatedBY: { type: Types.ObjectId, ref: "User" },

    wishUserList: [{ type: Types.ObjectId, ref: "User" }],
    custmID: String,
    IsDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

ProductSchema.virtual("Review", {
  ref: "Review",
  localField: "_id",
  foreignField: "productID",
});

//meaning if not create model created forced
const ProductModel = mongoose.models.Product || model("Product", ProductSchema);
export default ProductModel;
