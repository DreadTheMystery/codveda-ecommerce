require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>
  res.json({ ok: true, message: "Clothing Shop API (Level 1) - MongoDB" })
);
app.use("/api/products", productsRouter);

// error handler
app.use(errorHandler);

async function start() {
  if (!MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI, { dbName: undefined }); // dbName can be part of URI
    console.log("Connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
