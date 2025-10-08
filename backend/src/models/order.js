const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./user");
const Product = require("./product");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    orderNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    items: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.ENUM("cash_on_delivery", "bank_transfer", "card"),
      defaultValue: "cash_on_delivery",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      set(value) {
        this.setDataValue("notes", value ? value.trim() : null);
      },
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    hooks: {
      beforeCreate: (order) => {
        if (!order.orderNumber) {
          const timestamp = Date.now().toString();
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
          order.orderNumber = `CVE-${timestamp.slice(-8)}${random}`;
        }
      },
    },
  }
);

// Instance methods
Order.prototype.calculateTotal = function () {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + parseFloat(item.price) * parseInt(item.quantity);
  }, 0);
};

// Note: Associations will be defined in models/index.js to avoid circular dependencies

module.exports = Order;
