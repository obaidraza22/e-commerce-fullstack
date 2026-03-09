const mongoose = require("mongoose");

async function connectDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DATABASE CONNECTED");
}

module.exports = connectDb;
