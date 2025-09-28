const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      // Get user from token
      const user = await User.findById(decoded.userId).select("-password");
      if (!user || !user.isActive) {
        return res.status(401).json({
          error: "Access denied. User not found or inactive.",
        });
      }

      req.userId = decoded.userId;
      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        error: "Access denied. Invalid token.",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal server error during authentication.",
    });
  }
};

module.exports = authMiddleware;
