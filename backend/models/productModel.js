const { DataTypes } = require('sequelize');

const sequelize =
    require('../database/connection');

const Product = sequelize.define('Product', {

    id: {

        type: DataTypes.INTEGER,

        autoIncrement: true,

        primaryKey: true

    },

    nombre: {

        type: DataTypes.STRING,

        allowNull: false

    },

    categoria: {

        type: DataTypes.STRING,

        allowNull: false

    },

    precio: {

        type: DataTypes.FLOAT,

        allowNull: false

    },

    stock: {

        type: DataTypes.INTEGER,

        allowNull: false

    },

    proveedor: {

        type: DataTypes.STRING,

        allowNull: false

    },

    lote: {

        type: DataTypes.STRING,

        allowNull: false

    }

});

module.exports = Product;