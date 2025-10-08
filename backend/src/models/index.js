const { sequelize } = require("../config/database");
const User = require("./user");
const Product = require("./product");
const Order = require("./order");
const Contact = require("./contact");

// Define associations
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Order, { foreignKey: "userId", as: "orders" });

const models = {
  User,
  Product,
  Order,
  Contact,
  sequelize,
};

module.exports = models;
