const { timeStamp } = require("console");
const { dbConf } = require("../db"); // Импорт экземпляра Sequelize из db.js
const { DataTypes } = require("sequelize");

module.exports = () => {
  const User = dbConf.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    position: DataTypes.CHAR(50),
    telegram: DataTypes.STRING,
    phoneNumber: DataTypes.CHAR(30),
    birthDate: DataTypes.DATEONLY,
  });

  return User;
};
