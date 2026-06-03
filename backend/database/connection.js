const { Sequelize } = require('sequelize');
const db = require('../config').db;

const sequelize = new Sequelize(
    db.POSTGRES_DB,
    db.POSTGRES_USER,
    db.POSTGRES_PASSWORD,
    {
        host: db.host,
        port: db.port,
        dialect: 'postgres',
        logging: false
    }
);

// Probar conexión
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexion OK con PostgreSQL');
    } catch (error) {
        console.error('❌ Error PostgreSQL:', error);
    }
};

connectDB();

module.exports = sequelize;