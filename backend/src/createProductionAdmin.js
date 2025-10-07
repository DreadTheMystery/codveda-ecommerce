require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function createProductionAdmin() {
  console.log("🚀 Creating Admin Account for Production");
  console.log("This will create your admin account on the production database\n");

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set in production environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ Connected to Production MongoDB\n");

    const adminData = {
      name: "Abdulgafar Ridwan",
      email: "engr.abdulridwan@gmail.com",
      password: "Akin7234508211@",
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
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("✅ Admin already exists in production!");
      console.log(`📧 Email: ${existingAdmin.email}`);
      console.log(`👤 Name: ${existingAdmin.name}`);
      console.log(`🔑 Role: ${existingAdmin.role}`);
      
      // Update password to ensure it's correct
      existingAdmin.password = adminData.password;
      await existingAdmin.save();
      console.log("🔄 Password updated to ensure it's correct");
    } else {
      // Create new admin
      const newAdmin = await User.create(adminData);
      console.log("🎉 New admin created in production!");
      console.log(`📧 Email: ${newAdmin.email}`);
      console.log(`👤 Name: ${newAdmin.name}`);
      console.log(`🔑 Role: ${newAdmin.role}`);
    }

    console.log("\n═══════════════════════════════════════");
    console.log("🔐 PRODUCTION ADMIN LOGIN CREDENTIALS:");
    console.log("═══════════════════════════════════════");
    console.log(`📧 Email: ${adminData.email}`);
    console.log(`🔑 Password: ${adminData.password}`);
    console.log("═══════════════════════════════════════");
    console.log("✅ Ready for production login!");

    await mongoose.disconnect();
    console.log("\n✅ Production admin setup complete!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createProductionAdmin();
