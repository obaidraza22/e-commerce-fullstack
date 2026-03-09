const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [3, "First Name is too short"],
      maxLength: [10, "First Name is too long"],
      required: true,
    },
    lastName: {
      type: String,
      minLength: [3, "Last Name is too short"],
      maxLength: [10, "Last Name is too long"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("Users", userSchema);
module.exports = User;
