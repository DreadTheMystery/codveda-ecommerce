require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const crypto = require("crypto");

async function createSecureAdmin() {
  console.log("🔐 Creating Your Personal Secure Admin Account");
  console.log("This will create a private admin account for you only.\n");
  console.log("⚠️  Your email will be taken from environment variables - NEVER saved in code!\n");

  // Get admin details from environment variables (SECURE METHOD)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminName = process.env.ADMIN_NAME || "Site Owner";

  if (!adminEmail) {
    console.error("❌ Please set ADMIN_EMAIL environment variable");
    console.error("Example: ADMIN_EMAIL='your@email.com' node src/createSecureAdmin.js");
    console.error("This keeps your email completely private and secure!");
    process.exit(1);
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    // Generate a secure random password
    const securePassword = crypto.randomBytes(16).toString('hex') + "2024!";

    // Your personal admin account (COMPLETELY PRIVATE!)
    const personalAdmin = {
      name: adminName,
      email: adminEmail, // From environment variable - never saved in file!
      password: securePassword,
      phone: "+234 000 000 0000",
      address: {
        street: "Private Address",
        city: "Your City",
        state: "Your State",
        zipCode: "000000",
        country: "Nigeria",
      },
      role: "admin",
      isActive: true,
    };

    // Check if your personal admin already exists
    const existingOwner = await User.findOne({ email: personalAdmin.email });
    if (existingOwner) {
      console.log("⚠️  Personal admin account already exists!");
      console.log(`📧 Email: ${existingOwner.email}`);
      console.log(`👤 Name: ${existingOwner.name}`);
      console.log("🔑 Password: [Previously created - check your records]");
    } else {
      // Create your personal admin account
      const createdOwner = await User.create(personalAdmin);
      console.log("🎉 Your Personal Admin Account Created Successfully!\n");
      console.log("═══════════════════════════════════════");
      console.log("🔐 KEEP THESE CREDENTIALS SAFE & PRIVATE:");
      console.log("═══════════════════════════════════════");
      console.log(`📧 Email: ${createdOwner.email}`);
      console.log(`🔑 Password: ${securePassword}`);
      console.log(`👤 Name: ${createdOwner.name}`);
      console.log(`✅ Role: ${createdOwner.role}`);
      console.log("═══════════════════════════════════════");
      console.log("⚠️  IMPORTANT SECURITY NOTES:");
      console.log("1. Save these credentials in a password manager");
      console.log("2. Your email was taken from environment variable (100% secure!)");
      console.log("3. Never share these credentials publicly");
      console.log("4. Your email is NOT saved in any file or pushed to GitHub");
      console.log("═══════════════════════════════════════\n");
    }

    // Remove test admin accounts for security
    console.log("🧹 Cleaning up test admin accounts...");
    await User.deleteMany({
      email: {
        $in: [
          "admin@codveda.com",
          "superadmin@codveda.com", 
          "admin@example.com",
          "owner@yourcompany.com",
          "test@private.com"
        ],
      },
    });
    console.log("✅ Test admin accounts removed for security\n");

    await mongoose.disconnect();
    console.log("✅ Database connection closed");
    console.log("🔐 Your e-commerce site is now secure with your personal admin account!");
    console.log("🎯 Your email is completely private and will never be exposed on GitHub!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Personal admin creation failed:", err);
    process.exit(1);
  }
}

createSecureAdmin();
