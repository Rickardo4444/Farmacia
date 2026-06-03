// backend/iaProducts.js
const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const axios = require("axios");
const { Op } = require("sequelize");
const { enviarAlertaAsesor, enviarAlertaPedidoGrande } = require("../services/emailService");

// RUTA PRINCIPAL DE CONSULTA IA
router.get("/", async (req, res) => {
    try {
        const pregunta = req.query.q;
        if (!pregunta) {
            return res.status(400).json({ error: "Falta el parámetro 'q'" });
        }

        console.log("Pregunta:", pregunta);

        const textoLimpio = pregunta
            .toLowerCase()
            .replace(/[¿?.,]/g, "")
            .trim();

        const ignorar = [
            "tienen", "hay", "vendes", "venden", "quiero", 
            "necesito", "busco", "tendra", "farmacia"
        ];

        const palabras = textoLimpio.split(/\s+/);
        const palabraClave = palabras.find(p => !ignorar.includes(p));

        console.log("Palabra clave detectada:", palabraClave);

        if (!palabraClave) {
            return res.json({
                respuesta: "Hola, ¿en qué te puedo ayudar? Dime qué medicamento buscas.",
                infoProducto: null
            });
        }

        const productos = await Product.findAll({
            where: {
                nombre: {
                    [Op.iLike]: `%${palabraClave}%`
                }
            }
        });

        if (productos.length === 0) {
            return res.json({
                respuesta: `Lo siento, actualmente no contamos con ${palabraClave} en stock.`,
                infoProducto: null
            });
        }

        // Tomamos el primer producto que haga match para enviárselo al frontend como objeto interactivo
        const productoEncontrado = productos[0];

        const productosTexto = productos.map(p => 
            `Nombre: ${p.nombre} | Precio: S/ ${p.precio} | Stock: ${p.stock}`
        ).join("\n");

        const prompt = `<|system|>
Eres el asistente virtual de Farmacia SaludPlus. Tu única tarea es responder si hay o no disponibilidad basándote estrictamente en los datos provistos.
Reglas obligatorias:
1. Responde de forma muy corta, cordial y directa.
2. Si el stock es mayor a 0, di que "Sí hay" o palabras similares, indica el precio y la cantidad disponible.
3. Si el stock es igual a 0, di que "Se agotó" o "No hay stock".
4. No inventes información de otras tiendas ni supuestos envíos.

EJEMPLO 1 (Con Stock):
Datos: Nombre: Paracetamol 500mg | Precio: S/ 4.5 | Stock: 50
Usuario: ¿Tienen paracetamol?
Asistente: ¡Hola! Sí, contamos con Paracetamol 500mg. Su precio es de S/ 4.5 y tenemos 50 unidades disponibles.

EJEMPLO OBLIGATORIO A RESPONDER:
Datos actuales de la base de datos:
${productosTexto}
<|user|>
${pregunta}
<|assistant|>
`;

        console.log("Enviando a Ollama...");

        const response = await axios.post(
            "http://localhost:11434/api/generate",
            {
                model: "llama3.2:1b",
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.1,
                    num_predict: 60  
                }
            },
            { timeout: 90000 }
        );

        // Devolvemos la respuesta de Ollama e inyectamos la info del producto directo de la base de datos
        res.json({
            respuesta: response.data.response.trim(),
            infoProducto: {
                id: productoEncontrado.id,
                nombre: productoEncontrado.nombre,
                precio: productoEncontrado.precio,
                stock: productoEncontrado.stock
            }
        });

    } catch (error) {
        console.error("Error detallado:", error.message);
        res.status(500).json({ error: "Error IA", detalle: error.message });
    }
});

// NUEVO ENDPOINT 1: ALERTA ASESOR (CELULAR)
router.post("/contacto-asesor", async (req, res) => {
    const { celular } = req.body;
    if (!celular) return res.status(400).json({ error: "Falta el celular" });

    await enviarAlertaAsesor(celular);
    res.json({ success: true, message: "Alerta de asesor enviada por email." });
});

// NUEVO ENDPOINT 2: ALERTA PEDIDO GRANDE (MÁS DE 3 PRODUCTOS)
router.post("/alerta-pedido", async (req, res) => {
    const { productos } = req.body;
    if (!productos || productos.length === 0) return res.status(400).json({ error: "Falta lista de productos" });

    await enviarAlertaPedidoGrande(productos);
    res.json({ success: true, message: "Alerta de pedido grande enviada por email." });
});

module.exports = router;