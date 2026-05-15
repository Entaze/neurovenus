const requireAdmin = (req, res, next) => {
  const role = req.user?.role;

  if (!["admin", "superadmin"].includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

module.exports = requireAdmin;