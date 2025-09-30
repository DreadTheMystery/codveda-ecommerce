require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function resetAdminPassword() {
  console.log("🔐 Admin Password Reset Tool");
  console.log("This will reset the password for your admin account.\n");

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    // Get admin email
    const adminEmail = await askQuestion("Enter your admin email: ");

    // Find admin user
    const admin = await User.findOne({ email: adminEmail, role: "admin" });

    if (!admin) {
      console.log("❌ Admin account not found with that email.");
      console.log("Make sure you entered the correct email address.");
      rl.close();
      await mongoose.disconnect();
      process.exit(1);
    }

    // Generate new secure password
    const newPassword = crypto.randomBytes(16).toString("hex") + "2024!";

    // Update admin password
    admin.password = newPassword;
    await admin.save();

    console.log("\n🎉 Password Reset Successful!\n");
    console.log("═══════════════════════════════════════");
    console.log("🔐 NEW ADMIN CREDENTIALS:");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 NEW Password: ${newPassword}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log("═══════════════════════════════════════");
    console.log("⚠️  IMPORTANT:");
    console.log("1. Save this new password immediately");
    console.log("2. Store it in a secure password manager");
    console.log("3. The old password is no longer valid");
    console.log("═══════════════════════════════════════\n");

    rl.close();
    await mongoose.disconnect();
    console.log("✅ Password reset completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Password reset failed:", err);
    rl.close();
    process.exit(1);
  }
}

resetAdminPassword();
