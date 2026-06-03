const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Message = sequelize.define("Message", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Message;