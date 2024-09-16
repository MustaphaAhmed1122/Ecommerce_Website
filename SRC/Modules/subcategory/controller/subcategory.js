import slugify from "slugify";
import SubCategoryModel from "../../../../DB/Model/SubCategory.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import cloudinary from "../../../Utils/cloudinary.js";
import categoryModel from "../../../../DB/Model/Category.model.js";
import { nanoid } from "nanoid";

export const createsubcategory = asyncHandle(async (req, res, next) => {
  const { CategoryID } = req.params;
  if (!(await categoryModel.findById(CategoryID))) {
    return next(new Error("IN_Valid CategoryID", { cause: 400 }));
  }
  if (!req.file) {
    return next(new Error("Please Upload img", { cause: 400 }));
  }

  const name = req.body.name.toLowerCase();
  if (await SubCategoryModel.findOne({ name })) {
    return next(new Error(`Duplicated name ${name}`, { cause: 409 }));
  }
  const customID = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.Appname}/subcategory/${CategoryID}/${customID}`,
    }
  );

  const SubCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name, "-"),
    image: { secure_url, public_id },
    CategoryID,
    customID,
    createdBY: req.user._id,
  });

  return res.status(201).json({ message: "Created", SubCategory });
});

export const allsubcategory = asyncHandle(async (req, res, next) => {
  const SubCategory = await SubCategoryModel.find().populate({
    path: "CategoryID",
  });
  if (!SubCategory) {
    return next(new Error("no Data", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", SubCategory });
});

export const updatesubcategory = asyncHandle(async (req, res, next) => {
  const { CategoryID, SubCategoryId } = req.params;
  const SubCategory = await SubCategoryModel.findById({
    _id: SubCategoryId,
    CategoryID,
  });
  if (!SubCategory) {
    return next(new Error("Wrong ID", { cause: 404 }));
  }

  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase();
    if (SubCategory.name == req.body.name) {
      return next(new Error("Cannot update Same name", { cause: 409 }));
    }

    if (await SubCategoryModel.findOne({ name: req.body.name })) {
      return next(
        new Error(`Duplicated name ${req.body.name}`, { cause: 409 })
      );
    }

    SubCategory.name = req.body.name;
    SubCategory.slug = slugify(req.body.name, "-");
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.Appname}/subcategory/${CategoryID}/${SubCategory.customID}`,
      }
    );
    await cloudinary.uploader.destroy(SubCategory.image.public_id);
    SubCategory.image = { secure_url, public_id };
  }
  SubCategory.UpdatedBY = req.user._id;
  await SubCategory.save();
  return res.status(200).json({ message: "Done", SubCategory });
});
