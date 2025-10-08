const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { sequelize, testConnection } = require("./config/database");
const User = require("./models/user");

async function createAdmin() {
  try {
    await testConnection();
    await sequelize.sync({ force: false });

    // Create primary admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const existingAdmin = await User.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("✅ Primary admin user already exists");
      console.log(`📧 Email: ${existingAdmin.email}`);
    } else {
      const admin = await User.create({
        email: adminEmail,
        password: "admin123",
        name: process.env.ADMIN_NAME || "Admin User",
        role: "admin",
        phone: "1234567890",
        address: {
          street: "123 Admin St",
          city: "Admin City",
          state: "Admin State",
          zipCode: "12345",
          country: "Nigeria",
        },
      });

      console.log("✅ Primary admin user created successfully");
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔒 Password: admin123`);
    }

    // Create backup admin
    const backupEmail = "backup@example.com";
    const existingBackup = await User.findOne({
      where: { email: backupEmail },
    });

    if (!existingBackup) {
      const backupAdmin = await User.create({
        email: backupEmail,
        password: "backup123",
        name: "Backup Admin",
        role: "admin",
        phone: "0987654321",
        address: {
          street: "456 Backup Ave",
          city: "Backup City",
          state: "Backup State",
          zipCode: "54321",
          country: "Nigeria",
        },
      });

      console.log("✅ Backup admin user created successfully");
      console.log(`📧 Email: ${backupAdmin.email}`);
      console.log(`🔒 Password: backup123`);
    }

    console.log("\n🎉 Admin creation completed!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
