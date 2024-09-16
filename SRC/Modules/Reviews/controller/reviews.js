import OrderModel from "../../../../DB/Model/Order.model.js";
import ReviewModel from "../../../../DB/Model/Review.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";

export const AddReviews = asyncHandle(async (req, res, next) => {
  const { productID } = req.params;
  const { comment, rating } = req.body;

  //_______________check if ID's exist_________________
  const Order = await OrderModel.findOne({
    UserID: req.user._id,
    orderStatus: "deliverd",
    "products.productID": productID,
  });
  if (!Order) {
    return next(
      new Error("IN_Valid Product ID OR cannot Review before deliverd", {
        cause: 400,
      })
    );
  }

  //______________Check if user write review before____________________
  if (
    await ReviewModel.findOne({
      createdBY: req.user._id,
      productID,
      orderID: Order._id,
    })
  ) {
    return next(new Error("you already write Review", { cause: 400 }));
  }

  const Review = await ReviewModel.create({
    comment,
    rating,
    createdBY: req.user._id,
    orderID: Order._id,
    productID,
  });
  return res.status(201).json({ message: "Done", Review });
});

export const UpdateReviews = asyncHandle(async (req, res, next) => {
  const { productID, ReviewID } = req.params;

  const Review = await ReviewModel.updateOne(
    { _id: ReviewID, productID },
    req.body,
    { new: true }
  );
  return res.status(200).json({ message: "Updated" });
});
