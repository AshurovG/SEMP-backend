const { timeStamp } = require('console');
const { dbConf } = require('../db'); // Импорт экземпляра Sequelize из db.js
const { DataTypes } = require('sequelize');

module.exports = () => {
  const User = dbConf.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    avatar: DataTypes.STRING,
    department: DataTypes.STRING,
    position: DataTypes.STRING,
    telegram: DataTypes.STRING,
    whatsapp: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    isAdmin: DataTypes.BOOLEAN,
    status: DataTypes.STRING,
    lastCode: DataTypes.STRING,
  });

  return User;
};
