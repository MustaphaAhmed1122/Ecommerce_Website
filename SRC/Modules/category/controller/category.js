import slugify from "slugify";
import categoryModel from "../../../../DB/Model/Category.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import cloudinary from "../../../Utils/cloudinary.js";

export const createCategory = asyncHandle(async (req, res, next) => {
  if (!req.file) {
    return next(new Error("Please Uplaod PIC", { cause: 400 }));
  }
  const name = req.body.name.toLowerCase();
  if (await categoryModel.findOne({ name })) {
    return next(new Error(`Duplicated name ${name}`, { cause: 409 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.Appname}/category/${req.body.name}`,
    }
  );
  const category = await categoryModel.create({
    name,
    slug: slugify(name, "-"),
    image: { secure_url, public_id },
    createdBY: req.user._id,
  });
  return res.status(201).json({ message: "Created", category });
});

export const allcategory = asyncHandle(async (req, res, next) => {
  const category = await categoryModel.find().populate([
    {
      path: "SubCategory",
    },
  ]);
  if (!category) {
    return next(new Error("no Data", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", category });
});

export const updateCatogry = asyncHandle(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.categoryID);
  if (!category) {
    return next(new Error("Wrong ID", { cause: 404 }));
  }

  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase();
    if (category.name == req.body.name) {
      return next(new Error("Cannot update Same name", { cause: 409 }));
    }

    if (await categoryModel.findOne({ name: req.body.name })) {
      return next(
        new Error(`Duplicated name ${req.body.name}`, { cause: 409 })
      );
    }

    category.name = req.body.name;
    req.body.slug = slugify(req.body.name, "-");
  }
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `E_commerce/category`,
      }
    );
    await cloudinary.uploader.destroy(category.image.public_id);
    category.image = { secure_url, public_id };
  }
  category.UpdatedBy = req.user._id;
  await category.save();
  return res.status(200).json({ message: "Done", category });
});
