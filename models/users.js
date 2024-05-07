'use strict';
const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING(50), allowNull: false },
    last_name: { type: DataTypes.STRING(50), allowNull: false },
    username: { type: DataTypes.STRING(50), allowNull: false },
    password: { type: DataTypes.STRING(100), allowNull: false },
    user_role: { type: DataTypes.INTEGER(1), allowNull: false }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};