import BrandModel from "../../../../DB/Model/Brand.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import cloudinary from "../../../Utils/cloudinary.js";

export const allbrand = asyncHandle(async (req, res, next) => {
  const Brand = await BrandModel.find();
  if (!Brand) {
    return next(new Error("no Data", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", Brand });
});

export const CreateBrand = asyncHandle(async (req, res, next) => {
  const name = req.body.name.toLowerCase();

  if (!req.file) {
    return next(new Error("Image required", { cause: 404 }));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.Appname}/Brand`,
    }
  );

  if (await BrandModel.findOne({ name })) {
    return next(new Error(`Duplicated name ${name}`, { cause: 409 }));
  }

  const Brand = await BrandModel.create({
    name,
    image: { secure_url, public_id },
    createdBY: req.user._id,
  });
  return res.status(201).json({ message: "Created", Brand });
});

export const UpdateBrand = asyncHandle(async (req, res, next) => {
  const Brand = await BrandModel.findById(req.params.BrandID);
  if (!Brand) {
    return next(new Error("Wrong ID", { cause: 404 }));
  }

  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase();
    if (Brand.name == req.body.name) {
      return next(new Error("Cannot update Same name", { cause: 409 }));
    }

    if (await BrandModel.findOne({ name: req.body.name })) {
      return next(
        new Error(`Duplicated name ${req.body.name}`, { cause: 409 })
      );
    }
    Brand.name = req.body.name;
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.Appname}/Brand`,
      }
    );
    await cloudinary.uploader.destroy(Brand.image.public_id);
    Brand.image = { secure_url, public_id };
  }
  Brand.UpdatedBY = req.user._id;
  await Brand.save();
  return res.status(200).json({ message: "Done", Brand });
});
