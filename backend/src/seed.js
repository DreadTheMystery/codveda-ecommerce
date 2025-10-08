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
        name: "Egyptian Black Abaya",
        description:
          "Elegant flowing abaya made from premium Egyptian cotton with intricate embroidery",
        price: 8500,
        image_url:
          "https://via.placeholder.com/400x300?text=Egyptian+Black+Abaya",
        category: "Abaya",
        stock: 15,
      },
      {
        name: "Dubai Luxury Abaya",
        description:
          "Premium Dubai-style abaya with beautiful stone work and modern cut",
        price: 12000,
        image_url:
          "https://via.placeholder.com/400x300?text=Dubai+Luxury+Abaya",
        category: "Abaya",
        stock: 10,
      },
      {
        name: "Traditional Jallabiya",
        description:
          "Comfortable traditional jallabiya perfect for daily wear and prayers",
        price: 4500,
        image_url:
          "https://via.placeholder.com/400x300?text=Traditional+Jallabiya",
        category: "Jallabiya",
        stock: 20,
      },
      {
        name: "Ankara Print Dress",
        description: "Vibrant African Ankara print dress with modern tailoring",
        price: 6500,
        image_url:
          "https://via.placeholder.com/400x300?text=Ankara+Print+Dress",
        category: "Ankara",
        stock: 18,
      },
      {
        name: "French Lace Kaftan",
        description: "Elegant French lace kaftan with beautiful patterns",
        price: 7500,
        image_url:
          "https://via.placeholder.com/400x300?text=French+Lace+Kaftan",
        category: "Laces",
        stock: 12,
      },
      {
        name: "Kampala Cotton Set",
        description: "High-quality Kampala cotton traditional wear set",
        price: 5500,
        image_url:
          "https://via.placeholder.com/400x300?text=Kampala+Cotton+Set",
        category: "Kampala",
        stock: 16,
      },
      {
        name: "Shedda Traditional Dress",
        description:
          "Beautiful shedda with traditional patterns and comfortable fit",
        price: 4800,
        image_url:
          "https://via.placeholder.com/400x300?text=Shedda+Traditional+Dress",
        category: "Shedda",
        stock: 14,
      },
      {
        name: "Premium Chiffon Veil",
        description:
          "Lightweight chiffon veil with elegant drape and quality finish",
        price: 2200,
        image_url:
          "https://via.placeholder.com/400x300?text=Premium+Chiffon+Veil",
        category: "Veils",
        stock: 25,
      },
      {
        name: "Silk Square Hijab",
        description:
          "High-quality silk hijab with beautiful texture and color options",
        price: 1800,
        image_url: "https://via.placeholder.com/400x300?text=Silk+Square+Hijab",
        category: "Hijab",
        stock: 30,
      },
      {
        name: "Traditional Prayer Cap",
        description: "Comfortable prayer cap made from breathable cotton",
        price: 1200,
        image_url:
          "https://via.placeholder.com/400x300?text=Traditional+Prayer+Cap",
        category: "Caps",
        stock: 35,
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
