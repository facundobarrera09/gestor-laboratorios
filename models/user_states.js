'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_states extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User_states.hasMany(models.Users, {
        foreignKey: 'id'
      });
    }
  }
  User_states.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    deletedAt: DataTypes.DATE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER,
    deletedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_states',
  });
  return User_states;
};