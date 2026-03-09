const Cart = require("../models/cart");

async function getCart(req, res) {
  try {
    const { userId } = req.user;
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res
        .status(200)
        .json({ message: "Your cart is empty", products: [] });
    }

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function increaseQuantity(req, res) {
  try {
    const { productId } = req.body;
    const { userId } = req.user;
    if (!productId || !userId)
      return res.status(404).json({ message: "Invalid query" });

    const cart = await Cart.findOne({ userId }, "userId products").populate(
      "products.productId",
    );
    const index = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId.toString(),
    );
    cart.products[index].quantity += 1;
    await cart.save();

    res.status(202).json({ message: "Quantity increased" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
}

async function decreaseQuantity(req, res) {
  try {
    const { productId } = req.body;
    const { userId } = req.user;
    if (!productId || !userId)
      return res.status(404).json({ message: "Invalid query" });

    const cart = await Cart.findOne({ userId }, "userId products").populate(
      "products.productId",
    );
    const index = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId.toString(),
    );
    cart.products[index].quantity -= 1;
    if (cart.products[index].quantity === 0) {
      cart.products.splice(index, 1);
    }

    await cart.save();

    res.status(202).json({ message: "Quantity decreased" });
  } catch (err) {
    return res.status(500).json({ message: "server error" });
  }
}

async function addProductToCart(req, res) {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req.user;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: quantity || 1 }],
      });
      await cart.save();
      return res.status(200).json(cart);
    }

    const itemIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity || 1;
    } else {
      cart.products.push({ productId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Product added in cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function deleteProductFromCart(req, res) {
  try {
    const { productId } = req.body;
    const { userId } = req.user;

    const result = await Cart.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          products: { productId: productId },
        },
      },
      { new: true },
    );
    console.log(result);

    if (!result)
      return res.status(404).json({ message: "Item not found in cart" });

    res.status(200).json({ message: "Product removed successfully" });
    // const cart = await Cart.findOne({ userId });
    // const index = cart.products.findIndex(
    //   (p) => p.productId.toString() === productId,
    // );
    // if (index > -1) {
    //   cart.products.splice(index, 1);
    //   await cart.save();
    //   return res.status(200).json({ message: "Item deleted successfully" });
    // }
    // res.status(404).json({ message: "Item not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getCart,
  increaseQuantity,
  decreaseQuantity,
  addProductToCart,
  deleteProductFromCart,
};
