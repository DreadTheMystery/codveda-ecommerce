require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function fixProductionAdmin() {
  console.log("🔧 Fixing Production Admin Login Issue");
  console.log(
    "This will ensure your admin works on both local and production\n"
  );

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to Database\n");

    // Your correct admin credentials
    const correctEmail = "engr.abdulridwan@gmail.com";
    const correctPassword = "Akin7234508211@";
    const correctName = "Abdulgafar Ridwan";

    // Check for existing admins with different emails
    const possibleEmails = [
      "engr.abdulridwan@gmail.com",
      "abdulgafarridwan@gmail.com",
      "engr.abdulridwan",
    ];

    console.log("🔍 Checking for existing admin accounts...");
    let foundAdmin = null;

    for (const email of possibleEmails) {
      const admin = await User.findOne({ email, role: "admin" });
      if (admin) {
        console.log(`✅ Found admin: ${email}`);
        foundAdmin = admin;
        break;
      }
    }

    if (foundAdmin) {
      // Update existing admin to correct credentials
      foundAdmin.email = correctEmail;
      foundAdmin.password = correctPassword;
      foundAdmin.name = correctName;
      foundAdmin.isActive = true;
      await foundAdmin.save();
      console.log("🔄 Updated existing admin with correct credentials");
    } else {
      // Create new admin
      const newAdmin = await User.create({
        name: correctName,
        email: correctEmail,
        password: correctPassword,
        phone: "+234 000 000 0000",
        address: {
          street: "Admin Address",
          city: "Lagos",
          state: "Lagos State",
          zipCode: "100001",
          country: "Nigeria",
        },
        role: "admin",
        isActive: true,
      });
      console.log("🎉 Created new admin account");
      foundAdmin = newAdmin;
    }

    // Clean up any duplicate admin accounts
    await User.deleteMany({
      role: "admin",
      _id: { $ne: foundAdmin._id },
    });

    console.log("\n═══════════════════════════════════════");
    console.log("🔐 FIXED ADMIN CREDENTIALS (PRODUCTION READY):");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${correctEmail}`);
    console.log(`🔑 Password: ${correctPassword}`);
    console.log(`👤 Name: ${correctName}`);
    console.log("═══════════════════════════════════════");
    console.log("✅ This will work on BOTH local and production!");
    console.log("🚀 Ready to deploy and login!");

    await mongoose.disconnect();
    console.log("\n✅ Admin login issue fixed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixProductionAdmin();
