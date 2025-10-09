// require("dotenv").config();
const path = require("path");
// load backend/.env no matter where you start the process from
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const { sequelize, testConnection } = require("./config/database");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const ordersRouter = require("./routes/orders");
const contactRouter = require("./routes/contact");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "https://nafsykay.netlify.app",
      "https://codveda-ecommerce-frontend.onrender.com",
      process.env.FRONTEND_URL,
    ];

    // Allow all netlify.app subdomains (including deploy previews)
    const isNetlifyDomain = origin.includes(".netlify.app");
    const isOnRenderDomain = origin.includes(".onrender.com");
    const isAllowedOrigin = allowedOrigins.includes(origin);

    if (isAllowedOrigin || isNetlifyDomain || isOnRenderDomain) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
  // Allow localhost for development
  const origin = req.headers.origin;
  if (
    origin &&
    (origin.includes("localhost") || origin.includes("127.0.0.1"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "https://nafsykay.onrender.com"
    );
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // respond to OPTIONS preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

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
app.use("/api/contact", contactRouter);

// error handler
app.use(errorHandler);

async function start() {
  // Check for database configuration
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction && !DATABASE_URL) {
    console.error("DATABASE_URL not set for production environment");
    process.exit(1);
  }

  try {
    // Test database connection
    await testConnection();

    // Sync database models (creates tables if they don't exist)
    // Use force: false and alter: false in production to avoid migration issues
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { force: false, alter: false }
      : { alter: true };
    
    try {
      await sequelize.sync(syncOptions);
      console.log("✅ Database synchronized successfully.");
    } catch (syncError) {
      console.warn("⚠️ Database sync failed, trying with force: false:", syncError.message);
      // Fallback: try without altering existing tables
      await sequelize.sync({ force: false, alter: false });
      console.log("✅ Database synchronized with fallback method.");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
      console.log(
        `📂 Database: ${
          isProduction ? "PostgreSQL (Production)" : "SQLite (Development)"
        }`
      );
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
