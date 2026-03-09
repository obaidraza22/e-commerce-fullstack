const Cart = require("../models/cart");
const Orders = require("../models/orders");

async function getAllOrders(req, res) {
  try {
    const orders = await Orders.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function getSingleOrder(req, res) {
  try {
    const { userId } = req.user;
    const order = await Orders.findOne({ userId }).populate(
      "products.productId",
    );
    if (!order) return res.status(404).json({ message: "No order placed" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function createOrder(req, res) {
  try {
    const { cartId } = req.body;

    const cart = await Cart.findOne({
      _id: cartId,
      userId: req.user.userId,
    }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ message: "Cannot place order: Cart is empty or not found" });
    }

    let totalAmount = 0;
    const orderProducts = cart.products.map((item) => {
      const price = item.productId.discountPrice;
      totalAmount += price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        priceAtPurchase: price,
      };
    });

    const order = await Orders.create({
      userId: cart.userId,
      products: orderProducts,
      totalAmount: totalAmount,
      status: "pending",
    });

    await Cart.findByIdAndUpdate(cartId, { $set: { products: [] } });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getAllOrders, getSingleOrder, createOrder };
