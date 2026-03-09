const Product = require("../models/product");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const { imageSizeFromFile } = require("image-size/fromFile");

async function getAllProduct(req, res) {
  try {
    const allProduct = await Product.find(
      {},
      "-createdAt -imageDeleteUrl -thumbnail -updatedAt, -__v",
    );
    res.status(200).json(allProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function getSingleProduct(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "Id is not specified" });

    const product = await Product.findOne(
      { _id: id },
      "-__v -updatedAt -createdAt -imageDeleteUrl -thumbnail",
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function addProductController(req, res) {
  const { productName, description, originalPrice, discountPrice, inStock } =
    req.body;
  console.log(productName);

  try {
    const isValid = await imageValidator(req, res);
    if (!isValid) return;

    const imageData = await handleImageUpload(req, res);
    if (!imageData) return;

    const product = await Product.create({
      productName,
      description,
      originalPrice: Number(originalPrice),
      discountPrice: Number(discountPrice),
      imageUrl: imageData.data.url,
      imageDeleteUrl: imageData.data.delete_url,
      thumbnail: imageData.data.thumb.url,
      inStock: inStock !== undefined ? inStock === "true" : true,
    });

    res.status(200).json({ message: "Product Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal controller Error" });
  }
}

async function updateProductController(req, res) {
  try {
    const { id } = req.params;
    const prodData = req.body;

    const product = await Product.findOne({ _id: id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Product.findByIdAndUpdate(id, prodData);

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Srever Error", error });
  }
}

async function deleteProductController(req, res) {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ message: "Product id is not specified" });

    const product = await Product.findByIdAndDelete({ _id: id });
    if (!product) return res.status(403).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
}

async function imageValidator(req, res) {
  const imagePath = req.file.path;

  const dimension = await imageSizeFromFile(imagePath);
  const MAX_HEIGHT = 1080;
  const MAX_WIDTH = 1080;

  if (dimension.width > MAX_WIDTH || dimension.height > MAX_HEIGHT) {
    fs.unlinkSync(imagePath);
    res.status(402).json({
      message: "Images above 1080p is not allowed, try to resize you image",
    });
    return false;
  }
  return true;
}

async function handleImageUpload(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file upload" });

  const filePath = req.file.path;

  try {
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMG_API_KEY}`,
      form,
      { headers: { ...form.getHeaders() } },
    );

    fs.unlinkSync(filePath);
    // res.status(200).json({
    //   message: "Forwarded to API and local file deleted!",
    // });
    return response.data;
  } catch (error) {
    console.error("Forwarding failed:", error.message);
    res.status(500).send("Failed to forward image.");
  }
}

module.exports = {
  getAllProduct,
  getSingleProduct,
  addProductController,
  updateProductController,
  deleteProductController,
};
