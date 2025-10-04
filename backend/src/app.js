require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001", 
      "https://nafsykay.netlify.app",
      process.env.FRONTEND_URL,
    ];
    
    // Allow all netlify.app subdomains (including deploy previews)
    const isNetlifyDomain = origin.includes('.netlify.app');
    const isOnRenderDomain = origin.includes('.onrender.com'); 
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    if (isAllowedOrigin || isNetlifyDomain || isOnRenderDomain) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) =>
  res.json({
    ok: true,
    message: "CodVeda Clothing Shop API - Full-Stack E-commerce",
  })
);

// API routes
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);

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
