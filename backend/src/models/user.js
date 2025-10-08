const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("name", value.trim());
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        this.setDataValue("phone", value ? value.trim() : null);
      },
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Nigeria",
      },
    },
    role: {
      type: DataTypes.ENUM("customer", "admin"),
      defaultValue: "customer",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const user = { ...this.get() };
  delete user.password;
  return user;
};

module.exports = User;
