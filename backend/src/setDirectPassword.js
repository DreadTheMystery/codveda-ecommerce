require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function setDirectPassword() {
  console.log("🔐 Setting Your Custom Admin Password");
  console.log("Setting password for: engr.abdulridwan@gmail.com\n");

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    const adminEmail = "engr.abdulridwan@gmail.com";
    const newPassword = "Akin7234508211@";

    // Find admin user
    const admin = await User.findOne({ email: adminEmail, role: "admin" });

    if (!admin) {
      console.log("❌ Admin account not found with email:", adminEmail);
      await mongoose.disconnect();
      process.exit(1);
    }

    // Update admin password directly
    admin.password = newPassword;
    await admin.save();

    console.log("🎉 Custom Password Set Successfully!\n");
    console.log("═══════════════════════════════════════");
    console.log("🔐 YOUR ADMIN LOGIN CREDENTIALS:");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log("═══════════════════════════════════════");
    console.log(
      "✅ You can now login to your admin panel with these credentials!"
    );
    console.log("🎯 Your password is now easy to remember and secure.");
    console.log("═══════════════════════════════════════\n");

    await mongoose.disconnect();
    console.log("✅ Password updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Setting password failed:", err);
    process.exit(1);
  }
}

setDirectPassword();
