import slugify from "slugify";
import BrandModel from "../../../../DB/Model/Brand.model.js";
import SubCategoryModel from "../../../../DB/Model/SubCategory.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import cloudinary from "../../../Utils/cloudinary.js";
import { nanoid } from "nanoid";
import ProductModel from "../../../../DB/Model/Product.model.js";
import UserModel from "../../../../DB/Model/User.model.js";
import ApiFeatures from "../../../Utils/ApiFeatures.js";

export const addproduct = asyncHandle(async (req, res, next) => {
  const { name, CategoryID, SubCategoryId, BrandId, price, discount } =
    req.body;

  //_____________Check about subcategory or category____________________
  if (!(await SubCategoryModel.findOne({ _id: SubCategoryId, CategoryID }))) {
    return next(
      new Error("In_Valid SubCategoryId OR CategoryID", { cause: 400 })
    );
  }

  //_____________Check about Brand____________________
  if (!(await BrandModel.findOne({ _id: BrandId }))) {
    return next(new Error("In_Valid BrandId", { cause: 400 }));
  }

  //_____________Add Slug____________________
  req.body.slug = slugify(name, {
    replacement: "-",
    trim: true,
    lower: true,
  });

  //   req.body.finalprice = discount ? price - price * (discount / 100) : price; //to calculate total price if we have discount by if condition
  req.body.finalprice = Number.parseFloat(
    price - price * ((discount || 0) / 100)
  ).toFixed(2); //to calculate total price if we have discount by Or condition

  req.body.custmID = nanoid();
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.Mainimage[0].path,
    {
      folder: `${process.env.Appname}/Product/${req.body.custmID}`,
    }
  );
  req.body.Mainimage = { secure_url, public_id };

  if (req.files.SubImages) {
    req.body.SubImages = [];
    for (const file of req.files.SubImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.Appname}/Product/${req.body.custmID}/SubImages`,
        }
      );
      req.body.SubImages.push({ secure_url, public_id });
    }
  }

  req.body.createdBY = req.user._id;

  const product = await ProductModel.create(req.body);
  if (!product) {
    return next(new Error("Fail to added product", { cause: 409 }));
  }
  return res.status(201).json({ message: "Created Product", product });
});

export const allProduct = asyncHandle(async (req, res, next) => {
  const api = new ApiFeatures(
    ProductModel.find().populate([
      {
        path: "Review",
      },
    ]),
    req.query
  )
    .paginate()
    .filter()
    .sort()
    .select()
    .search();
  const products = await api.mongooseQuery;
  for (let i = 0; i < products.length; i++) {
    let calcRating = 0;
    for (let j = 0; j < products[i].Review.length; j++) {
      calcRating += products[i].Review[j].rating;
    }
    let avgRating = calcRating / products[i].Review.length;
    const product = products[i].toObject();
    product.avgRating = avgRating;
    products[i] = product;
  }
  return res.status(200).json({ message: "Done✔", products });
});

export const updateproduct = asyncHandle(async (req, res, next) => {
  const { productID } = req.params;
  const product = await ProductModel.findById(productID);

  //_____________Check about Product ID____________________
  if (!product) {
    new Error("In_Valid Product ID", { cause: 400 });
  }

  const { name, CategoryID, SubCategoryId, BrandId, price, discount } =
    req.body;

  //_____________Check about subcategory or category____________________
  if (CategoryID && SubCategoryId) {
    if (!(await SubCategoryModel.findOne({ _id: SubCategoryId, CategoryID }))) {
      return next(
        new Error("In_Valid SubCategoryId OR CategoryID", { cause: 400 })
      );
    }
  }

  //_____________Check about Brand____________________
  if (BrandId) {
    if (!(await BrandModel.findOne({ _id: BrandId }))) {
      return next(new Error("In_Valid BrandId", { cause: 400 }));
    }
  }

  //_____________Add Slug____________________
  if (name) {
    req.body.slug = slugify(name, {
      replacement: "-",
      trim: true,
      lower: true,
    });
  }

  //_____________Update price if we have new price and discount____________________
  if (price && discount) {
    req.body.finalprice = Number.parseFloat(
      price - price * ((discount || 0) / 100)
    ).toFixed(2); //to calculate total price if we have discount by Or condition
  } else if (price) {
    //add new price
    req.body.finalprice = Number.parseFloat(
      price - price * (product.discount / 100)
    ).toFixed(2);
  } else if (discount) {
    //add new discount
    req.body.finalprice = Number.parseFloat(
      product.price - product.price * (discount / 100)
    ).toFixed(2);
  }

  //_____________Update Main Image____________________
  if (req.files?.Mainimage?.length) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.Mainimage[0].path,
      {
        folder: `${process.env.Appname}/Product/${product.custmID}`,
      }
    );
    await cloudinary.uploader.destroy(product.Mainimage.public_id);
    req.body.Mainimage = { secure_url, public_id };
  }

  //_____________Update SubImages____________________
  if (req.files?.SubImages?.length) {
    req.body.SubImages = [];
    for (const file of req.files.SubImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.Appname}/Product/${req.body.custmID}/SubImages`,
        }
      );
      req.body.SubImages.push({ secure_url, public_id });
    }
  }

  req.body.UpdatedBY = req.user._id;
  const Updated = await ProductModel.updateOne({ _id: product._id }, req.body);

  return res.status(201).json({ message: "Updated Product✔" });
});

export const addTowishlist = asyncHandle(async (req, res, next) => {
  if (!(await ProductModel.findById(req.params.productID))) {
    return next(new Error("Wrong productID🤦‍♂️", { cause: 400 }));
  }

  await UserModel.updateOne(
    { _id: req.user._id },
    { $addToSet: { wishlist: req.params.productID } }
  );
  return res.status(200).json({ message: "added to your list✔" });
});

export const removeTowishlist = asyncHandle(async (req, res, next) => {
  if (!(await ProductModel.findById(req.params.productID))) {
    return next(new Error("Wrong productID🤦‍♂️", { cause: 400 }));
  }
  await UserModel.updateOne(
    { _id: req.user._id },
    { $pull: { wishlist: req.params.productID } }
  );
  return res.status(200).json({ message: "removed from your list✔" });
});
