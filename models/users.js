// user.js
"use strict";
const { Sequelize, Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Pickup_dropoff, {
        foreignKey: "pickup_dropoff_id",
      }); // Define association
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: { type: DataTypes.STRING(50), allowNull: false },
      last_name: { type: DataTypes.STRING(50), allowNull: false },
      username: { type: DataTypes.STRING(50), allowNull: false },
      password: { type: DataTypes.STRING(100), allowNull: false },
      user_role: { type: DataTypes.INTEGER(1), allowNull: false },
      mobile_number: { type: DataTypes.STRING(50), allowNull: false },
      email_add: { type: DataTypes.STRING(50), allowNull: false },
      passenger_group_id: { type: DataTypes.INTEGER(11), allowNull: false },
      pickup_dropoff_id: { type: DataTypes.INTEGER(11), allowNull: false }, // Add foreign key
      remember_token: { type: DataTypes.STRING(100), allowNull: true },
      password_reset_token: { type: DataTypes.STRING(100), allowNull: true },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "User",
      tableName: "user",
    }
  );
  return User;
};
