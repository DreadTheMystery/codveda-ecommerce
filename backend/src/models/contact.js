const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Contact = sequelize.define(
  "Contact",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.trim());
      },
    },
    subject: {
      type: DataTypes.STRING,
      defaultValue: "",
      set(value) {
        this.setDataValue("subject", value ? value.trim() : "");
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("message", value.trim());
      },
    },
  },
  {
    tableName: "contacts",
    timestamps: true,
  }
);

module.exports = Contact;
