require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function debugUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findOne({ email: "test@example.com" });
    if (user) {
      console.log("Found user:");
      console.log("- Name:", user.name);
      console.log("- Email:", user.email);
      console.log("- Role:", user.role);
      console.log("- Active:", user.isActive);
      console.log("- Password hash exists:", !!user.password);

      // Test password
      const isValid = await user.comparePassword("test123");
      console.log("- Password 'test123' is valid:", isValid);
    } else {
      console.log("User not found");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

debugUser();
