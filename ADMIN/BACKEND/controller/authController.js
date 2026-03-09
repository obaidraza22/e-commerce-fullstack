const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function signupController(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(403).json({ message: "Please Provide valid data" });

    const user = await User.findOne({ email });
    if (user)
      return res
        .status(404)
        .json({ message: "User already exist try loging in" });

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ firstName, lastName, email, password: hashedPassword });

    return res.status(200).json({ message: "Account Craeted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: err, message: "Internal Server Error" });
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(401).json({ message: "Please enter valid inputs" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect)
      return res.status(401).json({ message: "Password is incorrect" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Login successfully", user: user._id });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: err, message: "Internal server error" });
  }
}

module.exports = { signupController, loginController };
