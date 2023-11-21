import CartModel from "../../../../DB/Model/Cart.model.js";
import CouponModel from "../../../../DB/Model/Copoun.model.js";
import OrderModel from "../../../../DB/Model/Order.model.js";
import ProductModel from "../../../../DB/Model/Product.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";
import {
  clearItemFromCart,
  deleteItemFromCart,
} from "../../cart/controller/cart.js";
import { createInvoice } from "../../../Utils/PDF.js";
import SendEmail from "../../../Utils/SendEmail.js";

//______________________________order all cart & selected item
export const create = asyncHandle(async (req, res, next) => {
  const { products, phone, address, copounName, paymentType, name } = req.body;

  if (!req.body.products) {
    const cart = await CartModel.findOne({ UserID: req.user._id });
    if (!cart?.products.length) {
      return next(new Error("empty cart", { cause: 400 }));
    }
    req.body.IsCart = true;
    req.body.products = cart.products;
  }

  //________________________check copoun____________________
  if (copounName) {
    const copoun = await CouponModel.findOne({
      name: copounName.toLowerCase(),
      UserBY: { $nin: req.user._id },
    });
    if (!copoun || copoun.expireDate.getTime() < Date.now()) {
      return next(new Error("IN_Valid copoun OR Expired Date", { cause: 400 }));
    }
    req.body.copoun = copoun;
  }

  //________________________insert Products____________________
  const productIDs = [];
  const FinallProductlist = [];
  let subtotal = 0;
  for (let prodcut of req.body.products) {
    const checkproduct = await ProductModel.findOne({
      _id: prodcut.productID,
      stock: { $gte: prodcut.quantity },
      IsDeleted: false,
    });

    if (!checkproduct) {
      return next(
        new Error(`this product ${prodcut.productID} out of stock`, {
          cause: 400,
        })
      );
    }
    if (req.body.IsCart) {
      // prodcut =>BSON object
      prodcut = prodcut.toObject();
    }
    productIDs.push(prodcut.productID);
    prodcut.name = checkproduct.name;
    prodcut.unitPrice = checkproduct.finalprice;
    prodcut.finalprice = prodcut.quantity * prodcut.unitPrice.toFixed(2);
    FinallProductlist.push(prodcut);
    subtotal += prodcut.finalprice;
  }

  //________________________insert Order____________________
  const Order = await OrderModel.create({
    UserID: req.user._id,
    name,
    phone,
    address,
    products: FinallProductlist,
    copoupID: req.body.copoun?._id,
    subtotal,
    total:
      subtotal - ((subtotal * (req.body.copoun?.amount || 0)) / 100).toFixed(),
    paymentType,
    orderStatus: paymentType == "card" ? "waitpayment" : "placed",
  });

  //________________________decrease stock____________________
  for (const product of req.body.products) {
    await ProductModel.updateOne(
      { _id: product.productID },
      { $inc: { stock: -parseInt(product.quantity) } }
    );
  }

  //_____________________Store copoun____________________
  if (req.body.copoun) {
    await CouponModel.updateOne(
      { _id: req.body.copoun._id },
      { $addToSet: { UserBY: req.user._id } }
    );
  }
  //_________________Delete or decrease item_____________________
  if (req.body.IsCart) {
    await clearItemFromCart(req.user._id);
  } else {
    await deleteItemFromCart(req.user._id, productIDs);
  }
  //___________________________generate Invoice________________________

  const invoice = {
    shipping: {
      name: req.user.username,
      address: Order.address,
      city: "Cairo",
      state: "Cairo",
      country: "Egypt",
      postal_code: 94111,
    },
    items: Order.products,
    subtotal: subtotal,
    finalprice: Order.finalprice,
    total: Order.total,
    invoice_nr: Order._id,
    date: Order.createdAt,
  };
  await createInvoice(invoice, "invoice.pdf");
  await SendEmail({
    to: req.user.email,
    subject: "Invoice",
    attachments: [
      {
        path: "invoice.pdf",
        contentType: "application/pdf",
      },
    ],
  });

  return res.status(201).json({ message: "Created", Order });
});

export const cancelOrder = asyncHandle(async (req, res, next) => {
  const { orderID } = req.params;
  const { reason } = req.body;
  const order = await OrderModel.findOne({
    _id: orderID,
    UserID: req.user._id,
  });
  if (!order) {
    return next(new Error("IN_Valid OrderID", { cause: 404 }));
  }

  if (
    (order?.orderStatus != "placed" && order.paymentType == "cash") ||
    (order?.orderStatus != "waitpayment" && order.paymentType == "card")
  ) {
    return next(
      new Error(
        `cannot cancle your order after it changed to ${order.orderStatus}`,
        { cause: 400 }
      )
    );
  }
  //________________change status to cancel and update reason________________
  const cancleOrder = await OrderModel.updateOne(
    { _id: orderID },
    { orderStatus: "canceld", reason, UpdatedBy: req.user._id },
    { new: true }
  );

  if (!cancleOrder.matchedCount) {
    return next(new Error("Fail to cancel you order", { cause: 409 }));
  }

  //________________increase product after cancle order________________
  for (const product of order.products) {
    await ProductModel.updateOne(
      { _id: product.productID },
      { $inc: { stock: parseInt(product.quantity) } }
    );
  }

  //________________return coupon________________
  if (order.copoupID) {
    await CouponModel.updateOne(
      { _id: order.copoupID },
      { $pull: { UserBY: req.user._id } }
    );
  }
  return res.status(200).json({ message: "Cancle success", reason });
});

export const cancelOrderByAdmin = asyncHandle(async (req, res, next) => {
  const { orderID } = req.params;
  const { orderStatus } = req.body;
  const order = await OrderModel.findOne({ _id: orderID });

  if (!order) {
    return next(new Error("IN_Valid OrderID", { cause: 404 }));
  }

  const cancleOrder = await OrderModel.updateOne(
    { _id: orderID },
    { orderStatus, UpdatedBy: req.user._id }
  );

  if (!cancleOrder.matchedCount) {
    return next(new Error("Fail to update your order", { cause: 400 }));
  }
  return res.status(200).json({ message: "Updated Success" });
});
