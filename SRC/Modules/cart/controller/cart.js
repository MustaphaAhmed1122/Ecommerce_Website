import CartModel from "../../../../DB/Model/Cart.model.js";
import ProductModel from "../../../../DB/Model/Product.model.js";
import { asyncHandle } from "../../../Utils/ErrorHandelr.js";

export const create = asyncHandle(async (req, res, next) => {
  const { productID, quantity } = req.body;
  const product = await ProductModel.findById(productID);

  //_________________check on productID_____________________
  if (!product) {
    return next(new Error("IN_Valid productID", { cause: 400 }));
  }

  //_________________check if in stock_____________________
  if (product.stock < quantity || product.IsDeleted) {
    await ProductModel.updateOne(
      { _id: productID },
      { $addToSet: { wishUserList: req.user._id } }
    );
    return next(
      new Error(
        `not available in stock we have only: ${product.stock} pieces`,
        { cause: 400 }
      )
    );
  }

  const cart = await CartModel.findOne({ UserID: req.user._id });

  //_________________add new cart_________________
  if (!cart) {
    const newcart = await CartModel.create({
      UserID: req.user._id,
      products: [{ productID, quantity }],
    });
    return res.status(201).json({ message: "Done", cart: newcart });
  }
  //_________________update exist cart_________________
  let matchcart = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productID.toString() == productID) {
      cart.products[i].quantity = quantity;
      matchcart = true;
      break;
    }
  }
  //_________________add new element on exists cart_________________
  if (!matchcart) {
    cart.products.push({ productID, quantity });
  }
  await cart.save();
  return res.status(200).json({ message: "Updated", cart });
});

//____________________Function decrease item from cart____________________________
export async function deleteItemFromCart(UserID, productIDs) {
  const cart = await CartModel.updateOne(
    { UserID },
    {
      $pull: {
        products: { productID: { $in: productIDs } },
      },
    }
  );
  return cart;
}

export const deleteItem = asyncHandle(async (req, res, next) => {
  const { productID } = req.body;
  const cart = await deleteItemFromCart(req.user._id, productID);
  return res.status(200).json({ message: "Done👌", cart });
});

//____________________Function to clear all cart____________________________
export async function clearItemFromCart(UserID) {
  const cart = await CartModel.updateOne({ UserID }, { products: [] });
  return cart;
}

export const clearItem = asyncHandle(async (req, res, next) => {
  const cart = await clearItemFromCart(req.user._id);
  return res.status(200).json({ message: "Done👌", cart });
});
