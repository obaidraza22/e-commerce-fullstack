const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(403).json({ message: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ error: err, message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
