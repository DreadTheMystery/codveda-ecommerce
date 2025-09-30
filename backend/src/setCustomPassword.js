require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
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

function askPassword(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setCustomAdminPassword() {
  console.log("🔐 Set Custom Admin Password");
  console.log("This will let you set your own admin password.\n");

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

    // Get new password
    console.log("\n📝 Password Requirements:");
    console.log("- At least 8 characters long");
    console.log("- Include numbers and letters");
    console.log("- Use special characters for extra security\n");

    const newPassword = await askPassword("Enter your new password: ");

    if (newPassword.length < 8) {
      console.log("❌ Password must be at least 8 characters long");
      rl.close();
      await mongoose.disconnect();
      process.exit(1);
    }

    // Update admin password
    admin.password = newPassword;
    await admin.save();

    console.log("\n🎉 Custom Password Set Successfully!\n");
    console.log("═══════════════════════════════════════");
    console.log("🔐 YOUR ADMIN LOGIN:");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log("═══════════════════════════════════════");
    console.log("⚠️  IMPORTANT:");
    console.log("1. Remember this password - it cannot be recovered");
    console.log("2. Store it in a secure password manager");
    console.log("3. Use this to login to your admin panel");
    console.log("═══════════════════════════════════════\n");

    rl.close();
    await mongoose.disconnect();
    console.log("✅ Custom password set successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Setting custom password failed:", err);
    rl.close();
    process.exit(1);
  }
}

setCustomAdminPassword();
