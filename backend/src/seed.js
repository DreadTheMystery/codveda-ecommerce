require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding.");

    const sample = [
      {
        name: "White T-Shirt",
        description: "Comfortable cotton tee",
        price: 2500,
        image_url: "https://via.placeholder.com/400x300?text=White+T-Shirt",
        category: "T-Shirts",
        stock: 20,
      },
      {
        name: "Black Hoodie",
        description: "Warm fleece hoodie",
        price: 8000,
        image_url: "https://via.placeholder.com/400x300?text=Black+Hoodie",
        category: "Hoodies",
        stock: 12,
      },
      {
        name: "Sneakers",
        description: "Lightweight running shoes",
        price: 15000,
        image_url: "https://via.placeholder.com/400x300?text=Sneakers",
        category: "Shoes",
        stock: 8,
      },
      {
        name: "Denim Jeans",
        description: "Slim fit jeans",
        price: 7000,
        image_url: "https://via.placeholder.com/400x300?text=Denim+Jeans",
        category: "Pants",
        stock: 15,
      },
      {
        name: "Cap",
        description: "Baseball cap",
        price: 1200,
        image_url: "https://via.placeholder.com/400x300?text=Cap",
        category: "Accessories",
        stock: 30,
      },
    ];

    // Clear existing products
    await Product.deleteMany({});
    const inserted = await Product.insertMany(sample);
    console.log(`Inserted ${inserted.length} products.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
}

seed();
