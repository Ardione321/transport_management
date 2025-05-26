"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

// Load environment variables
require("dotenv").config(); // Load .env variables into process.env

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.MYSQL_DB || "transport_management",
  process.env.DB_USER || "ernani",
  process.env.DB_PASS || "eViaje$2025!",
  {
    host: process.env.DB_HOST || "13.229.221.117",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: true,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      timezone: "+08:00",
    },
    timezone: "+08:00",
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Import all models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Setup model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
