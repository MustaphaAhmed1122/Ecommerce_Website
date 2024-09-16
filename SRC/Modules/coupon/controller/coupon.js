import CouponModel from "../../../../DB/Model/Copoun.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import cloudinary from "../../../Utils/cloudinary.js";

export const allcopoun = asyncHandle(async (req, res, next) => {
  const Copoun = await CouponModel.find();
  if (!Copoun) {
    return next(new Error("no Data", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", Copoun });
});

export const CreateCopoun = asyncHandle(async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  if (await CouponModel.findOne({ name })) {
    return next(new Error(`Duplicated name ${name}`, { cause: 409 }));
  }

  req.body.createdBY = req.user._id;
  req.body.expireDate = new Date(req.body.expireDate);
  const Copoun = await CouponModel.create(req.body);

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.Appname}/Copoun`,
      }
    );
    Copoun.image = { secure_url, public_id };
  }

  return res.status(201).json({ message: "Created", Copoun });
});

export const UpdateCopoun = asyncHandle(async (req, res, next) => {
  const Copoun = await CouponModel.findById(req.params.CopounID);
  if (!Copoun) {
    return next(new Error("Wrong ID", { cause: 404 }));
  }

  if (req.body.name) {
    if (Copoun.name == req.body.name) {
      return next(new Error("Cannot update Same name", { cause: 409 }));
    }

    if (await CouponModel.findOne({ name: req.body.name })) {
      return next(
        new Error(`Duplicated name ${req.body.name}`, { cause: 409 })
      );
    }
    Copoun.name = req.body.name;
  }
  if (req.body.amount) {
    Copoun.amount = req.body.amount;
  }

  if (req.body.expireDate) {
    Copoun.expireDate = new Date(req.body.expireDate);
  }

  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.Appname}/Copoun`,
      }
    );
    if (Copoun.image) {
      await cloudinary.uploader.destroy(c.image.public_id);
    }

    Copoun.image = { secure_url, public_id };
  }

  Copoun.UpdatedBY = req.user._id;
  await Copoun.save();
  return res.status(200).json({ message: "Done", Copoun });
});
