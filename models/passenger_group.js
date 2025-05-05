'use strict';
const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Passenger_group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Passenger_group.init({
    id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
    passenger_group: { type: DataTypes.STRING(50), allowNull: false },
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Passenger_group',
    tableName: 'Passenger_group'
  });
  return Passenger_group;
};