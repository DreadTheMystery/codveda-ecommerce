require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function updateCorrectAdmin() {
  console.log("🔐 Updating Admin Account with Correct Email");
  console.log("Setting up: engr.abdulridwan@gmail.com\n");

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    const correctEmail = "engr.abdulridwan@gmail.com";
    const newPassword = "Akin7234508211@";

    // Find the admin with Gmail address
    let admin = await User.findOne({ email: correctEmail, role: "admin" });

    if (!admin) {
      console.log(
        "❌ Admin account with Gmail not found. Let me check what exists..."
      );
      const allAdmins = await User.find({ role: "admin" });
      console.log("Found admin accounts:");
      allAdmins.forEach((a) => console.log(`- ${a.email} (${a.name})`));

      // Try to find the admin without Gmail and update their email
      const adminWithoutGmail = await User.findOne({
        email: "engr.abdulridwan",
        role: "admin",
      });
      if (adminWithoutGmail) {
        console.log(
          "🔄 Updating email from engr.abdulridwan to engr.abdulridwan@gmail.com"
        );
        adminWithoutGmail.email = correctEmail;
        adminWithoutGmail.name = "Abdulgafar Ridwan";
        adminWithoutGmail.password = newPassword;
        await adminWithoutGmail.save();
        admin = adminWithoutGmail;
      } else {
        await mongoose.disconnect();
        process.exit(1);
      }
    } else {
      // Update existing Gmail admin
      admin.password = newPassword;
      admin.name = "Abdulgafar Ridwan";
      await admin.save();
    }

    console.log("🎉 Admin Account Updated Successfully!\n");
    console.log("═══════════════════════════════════════");
    console.log("🔐 YOUR CORRECT ADMIN LOGIN CREDENTIALS:");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log("═══════════════════════════════════════");
    console.log(
      "✅ You can now login to your admin panel with these credentials!"
    );
    console.log("🎯 Email is now correctly set to @gmail.com");
    console.log("═══════════════════════════════════════\n");

    // Clean up any duplicate admin accounts
    console.log("🧹 Cleaning up duplicate admin accounts...");
    await User.deleteMany({
      email: "engr.abdulridwan",
      role: "admin",
      _id: { $ne: admin._id },
    });

    await User.deleteMany({
      email: "secure-owner@private.com",
      role: "admin",
    });

    console.log("✅ Duplicate accounts removed for security");

    await mongoose.disconnect();
    console.log("✅ Database updated successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateCorrectAdmin();
