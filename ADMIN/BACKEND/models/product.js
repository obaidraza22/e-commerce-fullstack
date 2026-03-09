const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      minLength: [3, "Product Name is too short"],
      maxLength: [30, "Product Name is too long"],
      unique: true,
    },
    description: {
      type: String,
      minLength: [20, "Description is too short"],
      maxLength: [3000, "Description is too long"],
    },
    originalPrice: {
      type: Number,
      min: [1, "Price can't be below 1₹"],
      max: [999999, "Price is too high"],
    },
    discountPrice: {
      type: Number,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageDeleteUrl: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
