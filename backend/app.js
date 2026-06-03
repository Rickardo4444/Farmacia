const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// 1. MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json());

// 2. CONFIGURACIÓN DE BASE DE DATOS Y MODELOS (Siempre primero)
const sequelize = require('./database/connection');

// Importar y registrar modelos en Sequelize primero
require('./models/userModel');
require('./models/productModel');
require('./models/pacienteModel');

// 3. IMPORTAR ROUTERS (Después de que los modelos ya existen en memoria)
const useRouter = require('./routers/useRouters');
const productRouter = require('./routers/productRouters');
const pacienteRouter = require('./routers/pacienteRoutes');
const dashboardRouter = require('./routers/dashboardRouter');
const iaProductsRouter = require("./routers/iaProducts"); // Mover aquí abajo

// 4. CONFIGURACIÓN DE VISTAS (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 5. DEFINICIÓN DE RUTAS
app.get('/', (req, res) => {
    res.send('🚀 Servidor creado con EXPRESS');
});

app.use('/users', useRouter);
app.use('/products', productRouter);
app.use('/pacientes', pacienteRouter);
app.use('/dashboard', dashboardRouter);
app.use("/iaProducts", iaProductsRouter); // Registrar aquí abajo

// 6. INICIAR SERVIDOR
const startServer = async () => {
    try {
        await sequelize.sync();
        console.log('✅ Modelos sincronizados');
        app.listen(3000, () => {
            console.log('🚀 Servidor en puerto 3000');
        });
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

startServer();