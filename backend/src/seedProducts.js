const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { sequelize, testConnection } = require("./config/database");
const Product = require("./models/product");

async function seedProducts() {
  try {
    await testConnection();
    await sequelize.sync({ force: false });

    const sampleProducts = [
      {
        name: "Classic T-Shirt",
        description: "Comfortable cotton t-shirt perfect for everyday wear",
        price: 25.99,
        image_url: "/images/products/tshirt.jpg",
        category: "Clothing",
        stock: 100,
      },
      {
        name: "Denim Jeans",
        description: "High-quality denim jeans with perfect fit",
        price: 89.99,
        image_url: "/images/products/jeans.jpg",
        category: "Clothing",
        stock: 75,
      },
      {
        name: "Summer Dress",
        description: "Light and breezy summer dress for women",
        price: 45.5,
        image_url: "/images/products/dress.jpg",
        category: "Clothing",
        stock: 50,
      },
      {
        name: "Sneakers",
        description: "Comfortable walking sneakers for daily use",
        price: 79.99,
        image_url: "/images/products/sneakers.jpg",
        category: "Footwear",
        stock: 60,
      },
      {
        name: "Leather Jacket",
        description: "Premium leather jacket for style and warmth",
        price: 199.99,
        image_url: "/images/products/leather-jacket.jpg",
        category: "Outerwear",
        stock: 25,
      },
    ];

    console.log("🌱 Starting to seed products...");

    for (const productData of sampleProducts) {
      const existingProduct = await Product.findOne({
        where: { name: productData.name },
      });

      if (!existingProduct) {
        await Product.create(productData);
        console.log(`✅ Created product: ${productData.name}`);
      } else {
        console.log(`⚠️  Product already exists: ${productData.name}`);
      }
    }

    console.log("🎉 Product seeding completed!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();
