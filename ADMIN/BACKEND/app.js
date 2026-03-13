require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
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
  console.log("Server Running On Port: " + process.env.PORT);
});
