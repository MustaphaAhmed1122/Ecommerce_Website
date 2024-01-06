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
import Payment from "../../../Utils/Payment.js";
import Stripe from "stripe";

//______________________________order all cart & selected item
export const create = asyncHandle(async (req, res, next) => {
  const { products, phone, address, couponName, paymentType, name } = req.body;

  if (!req.body.products) {
    const cart = await CartModel.findOne({ UserID: req.user._id });
    if (!cart?.products.length) {
      return next(new Error("empty cart", { cause: 400 }));
    }
    req.body.IsCart = true;
    req.body.products = cart.products;
  }

  //________________________check copoun____________________
  if (couponName) {
    const coupon = await CouponModel.findOne({
      name: couponName.toLowerCase(),
      UserBY: { $nin: req.user._id },
    });
    if (!coupon || coupon.expireDate.getTime() < Date.now()) {
      return next(new Error("IN_Valid copoun OR Expired Date", { cause: 400 }));
    }
    req.body.coupon = coupon;
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
    couponID: req.body.coupon?._id,
    subtotal,
    total:
      subtotal - ((subtotal * (req.body.coupon?.amount || 0)) / 100).toFixed(),
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
  if (req.body.coupon) {
    await CouponModel.updateOne(
      { _id: req.body.coupon._id },
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
  // const invoice = {
  //   shipping: {
  //     name: req.user.username,
  //     address: Order.address,
  //     city: "Cairo",
  //     state: "Cairo",
  //     country: "Egypt",
  //     postal_code: 94111,
  //   },
  //   items: Order.products,
  //   subtotal: subtotal,
  //   finalprice: Order.finalprice,
  //   total: Order.total,
  //   invoice_nr: Order._id,
  //   date: Order.createdAt,
  // };
  // await createInvoice(invoice, "invoice.pdf");
  // await SendEmail({
  //   to: req.user.email,
  //   subject: "Invoice",
  //   attachments: [
  //     {
  //       path: "invoice.pdf",
  //       contentType: "application/pdf",
  //     },
  //   ],
  // });

  //_______________________Stripe Payment_____________________________
  if (Order.paymentType == "card") {
    const stripe = new Stripe(process.env.STRIPE_KEY);

    if (req.body.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.amount,
        duration: "once",
      });
      req.body.couponID = coupon.id;
    }
    const session = await Payment({
      stripe,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      metadata: {
        orderID: Order._id.toString(),
      },
      cancel_url: `${process.env.Cancel_URL}?orderID=${Order._id.toString()}`,
      success_url: `${process.env.Success_URL}?orderID=${Order._id.toString()}`,
      line_items: Order.products.map((prodcut) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: prodcut.name,
            },
            unit_amount: prodcut.unitPrice,
          },
          quantity: prodcut.quantity,
        };
      }),
      discounts: req.body.couponID ? [{ coupon: req.body.couponID }] : [],
    });

    return res.status(201).json({ message: "Card Order", Order, session });
  }

  //____________________________Cash Order_________________________________________
  return res.status(201).json({ message: "Cash Order", Order });
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
    return next(new Error("cancle to update your order", { cause: 400 }));
  }
  return res.status(200).json({ message: "cancled" });
});

export const webhook = asyncHandle(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const { orderID } = event.data.object.metadata;
  if (event.type == "checkout.session.completed") {
    await OrderModel.updateOne({ _id: orderID }, { orderStatus: "rejected" });
    return res.status(400).json({ message: "rejected Oreder🤦‍♂️" });
  }
  await OrderModel.updateOne({ _id: orderID }, { orderStatus: "placed" });

  return res.status(200).json({ message: "Done✔" });
});
