function roleMiddleware(req, res, next) {
  const user = req.user;
  if (!user.userId)
    return res.status(403).json({ message: "role Not authenticated" });

  if (user.role === "user")
    return res
      .status(403)
      .json({ message: "Only admin can access this feature" });

  next();
}

module.exports = roleMiddleware;
