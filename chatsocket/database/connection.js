const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "chatsocket", // base de datos
  "postgres", // usuario
  "1234", // contraseña
  {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexión a PostgreSQL establecida");
  })
  .catch((err) => {
    console.error("❌ Error conectando PostgreSQL:", err);
  });

module.exports = sequelize;