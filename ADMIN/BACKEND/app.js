require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: [
      "https://store-hub-lemon.vercel.app",
      "https://https://store-hub-admin.vercel.app/",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const connectDb = require("./config/db");
const authRouter = require("./router/authRoute");
const productRouter = require("./router/productRoute");
const cartRoute = require("./router/cartRoute");
const orderRoute = require("./router/orderRoute");

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);

app.listen(process.env.PORT, () => {
  connectDb();
  console.log("Server Running On Port 3000");
});

// {
//     "data": {
//         "id": "1w1FVmg",
//         "title": "img",
//         "url_viewer": "https://ibb.co/1w1FVmg",
//         "url": "https://i.ibb.co/b8TchK0/img.jpg",
//         "display_url": "https://i.ibb.co/b8TchK0/img.jpg",
//         "width": 236,
//         "height": 498,
//         "size": 23433,
//         "time": 1771488225,
//         "expiration": 600,
//         "image": {
//             "filename": "img.jpg",
//             "name": "img",
//             "mime": "image/jpeg",
//             "extension": "jpg",
//             "url": "https://i.ibb.co/b8TchK0/img.jpg"
//         },
//         "thumb": {
//             "filename": "img.jpg",
//             "name": "img",
//             "mime": "image/jpeg",
//             "extension": "jpg",
//             "url": "https://i.ibb.co/1w1FVmg/img.jpg"
//         },
//         "delete_url": "https://ibb.co/1w1FVmg/400483372959eea91ab9446f5ca245ae"
//     },
//     "success": true,
//     "status": 200
// }
