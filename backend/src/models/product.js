const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, default: 0 },
    image_url: { type: String, default: "" },
    category: { type: String, default: "" },
    stock: { type: Number, default: 0 },
  },
  {
    collection: "products",
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
