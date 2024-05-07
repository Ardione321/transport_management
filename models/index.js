'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// Initialize the first database connection -- CCS Dev DB
const sequelize = new Sequelize(
  process.env.MYSQL_DB || "transport_management", // Database name for the first connection
  process.env.DB_USER || "root", // User for the first connection
  process.env.DB_PASS || "", // Password for the first connection
  {
    host: process.env.DB_HOST || "localhost",
    dialect: 'mysql',
    logging: true, // Enable SQL query logging Dev purpose 
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      timezone: "+08:00"
    },
    timezone: "+08:00",
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Read and import all model files from the current directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // Import and initialize each model with the first database connection
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associate any defined associations between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // Expose the first database connection -- CCS DB
db.Sequelize = Sequelize;

module.exports = db;