require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

async function createTestUser() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for test user creation.");

    const testUser = {
      name: "Test User",
      email: "test@example.com",
      password: "test123",
      role: "customer",
      isActive: true,
    };

    // Check if test user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log(`Test user with email ${testUser.email} already exists.`);
      console.log("Test user details:");
      console.log(`- Name: ${existingUser.name}`);
      console.log(`- Email: ${existingUser.email}`);
      console.log(`- Role: ${existingUser.role}`);
      console.log(`- Active: ${existingUser.isActive}`);
    } else {
      const createdUser = await User.create(testUser);
      console.log("Test user created successfully!");
      console.log(`- Name: ${createdUser.name}`);
      console.log(`- Email: ${createdUser.email}`);
      console.log(`- Role: ${createdUser.role}`);
      console.log(`- Active: ${createdUser.isActive}`);
    }

    console.log("\n🎉 Test user setup completed!");
    console.log("\nYou can now login with:");
    console.log("Email: test@example.com | Password: test123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Test user creation failed:", err);
    process.exit(1);
  }
}

createTestUser();
