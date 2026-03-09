const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  createOrder,
} = require("../controller/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware, getAllOrders);

router.get("/getSingleOrder", authMiddleware, getSingleOrder);

router.post("/createOrder", authMiddleware, createOrder);

module.exports = router;
