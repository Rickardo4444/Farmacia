const { DataTypes } = require('sequelize');

const sequelize =
    require('../database/connection');

const Paciente = sequelize.define('Paciente', {

    id: {

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    nombre: {

        type: DataTypes.STRING,

        allowNull: false

    },

    edad: {

        type: DataTypes.INTEGER,

        allowNull: false

    },

    especialidad: {

        type: DataTypes.STRING,

        allowNull: false

    }

});

module.exports = Paciente;