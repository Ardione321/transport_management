'use strict';
const { Sequelize, Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Pickup_dropoff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Pickup_dropoff.belongsTo(models.Passenger_group, { foreignKey: 'passenger_group_id' }); // Define association
    }
  };
  Pickup_dropoff.init({
    id: { type: DataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
    pickup_dropoff: { type: DataTypes.STRING(50), allowNull: false },
    passenger_group_id: { type: DataTypes.INTEGER(11), allowNull: false }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Pickup_dropoff',
    tableName: 'Pickup_dropoff'
  });
  return Pickup_dropoff;
};