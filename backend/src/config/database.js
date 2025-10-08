const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  // Production PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Development SQLite
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });
}

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    const dbType =
      process.env.NODE_ENV === "production" && process.env.DATABASE_URL
        ? "PostgreSQL"
        : "SQLite";
    console.log(`✅ ${dbType} connection has been established successfully.`);
  } catch (error) {
    console.error("❌ Unable to connect to database:", error.message);
  }
};

module.exports = { sequelize, testConnection };
