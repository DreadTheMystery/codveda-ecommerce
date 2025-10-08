const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        error: "Email, password, and name are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
      phone,
      address,
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email,
        isActive: true,
      },
    });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const [updatedRows] = await User.update(
      { name, phone, address },
      {
        where: { id: req.userId },
        returning: true,
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await User.findByPk(req.userId);

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "New password must be at least 6 characters long",
      });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
