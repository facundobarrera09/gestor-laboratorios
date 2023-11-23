'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Personal_information extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Personal_information.belongsTo( models.document_type, {
        foreignKey: 'id',
        targetKey: 'documentType'
      })
    }
  }
  Personal_information.init({
    id: DataTypes.INTEGER,
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    documentType: DataTypes.INTEGER,
    documentNumber: DataTypes.STRING,
    ownedBy: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    createdBy: DataTypes.INTEGER,
    updatedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Personal_information',
  });
  return Personal_information;
};