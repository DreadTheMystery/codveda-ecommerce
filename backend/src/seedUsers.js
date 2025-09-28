require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Product = require("./models/product");

async function seedUsers() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for user seeding.");

    // Sample users
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        phone: "+234 801 234 5678",
        address: {
          street: "123 Lagos Street",
          city: "Lagos",
          state: "Lagos State",
          zipCode: "100001",
          country: "Nigeria",
        },
        role: "customer",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
        phone: "+234 802 345 6789",
        address: {
          street: "456 Abuja Avenue",
          city: "Abuja",
          state: "FCT",
          zipCode: "900001",
          country: "Nigeria",
        },
        role: "customer",
      },
      {
        name: "Admin User",
        email: "admin@codveda.com",
        password: "admin123",
        phone: "+234 803 456 7890",
        address: {
          street: "789 Admin Street",
          city: "Lagos",
          state: "Lagos State",
          zipCode: "100002",
          country: "Nigeria",
        },
        role: "admin",
      },
    ];

    // Clear existing users (optional - be careful in production)
    console.log("Clearing existing users...");
    await User.deleteMany({});

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`Inserted ${insertedUsers.length} users.`);

    // Display created users (without passwords)
    insertedUsers.forEach((user) => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    await mongoose.disconnect();
    console.log("User seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("User seeding failed:", err);
    process.exit(1);
  }
}

seedUsers();
