const express = require("express");
const router = express.Router();

const {
  getCart,
  increaseQuantity,
  addProductToCart,
  deleteProductFromCart,
  decreaseQuantity,
} = require("../controller/cartController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/my-cart", authMiddleware, getCart);

router.post("/add-to-cart", authMiddleware, addProductToCart);

router.post("/increaseQuantity", authMiddleware, increaseQuantity);

router.post("/decreaseQuantity", authMiddleware, decreaseQuantity);

router.post("/delete-product", authMiddleware, deleteProductFromCart);

module.exports = router;
