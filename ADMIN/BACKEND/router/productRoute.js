const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getAllProduct,
  addProductController,
  updateProductController,
  deleteProductController,
  getSingleProduct,
} = require("../controller/productController");

router.get("/allProducts", getAllProduct);

router.get("/:id", getSingleProduct);

router.post(
  "/add-product",
  authMiddleware,
  roleMiddleware,
  upload.single("image"),
  addProductController,
);

router.put(
  "/update-product/:id",
  authMiddleware,
  roleMiddleware,
  updateProductController,
);

router.delete(
  "/delete-product/:id",
  authMiddleware,
  roleMiddleware,
  deleteProductController,
);

module.exports = router;
