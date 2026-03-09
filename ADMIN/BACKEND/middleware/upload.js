const multer = require("multer");
// const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => {
//     const productName = req.body.name
//       ? req.body.name.replace(/\s+/g, "-").toLowerCase()
//       : "product";

//     const ext = path.extname(file.originalname);

//     cb(null, `${productName}-${Date.now()}${ext}`);
//   },
// });

const upload = multer({ storage: storage });

module.exports = upload;
