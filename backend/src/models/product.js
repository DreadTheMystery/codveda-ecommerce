const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("name", value.trim());
      },
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    image_url: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

module.exports = Product;
