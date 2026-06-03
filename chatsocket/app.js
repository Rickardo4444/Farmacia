const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173"
}));

const AIService = require("./services/aiService");
const ai = new AIService();

const sequelize = require("./database/connection");

const socket = require("socket.io");
const path = require("path");

const server = require("http").createServer(app);
const io = socket(server);

require("./socket")(io);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

//AI SERVICEE
app.get("/ia", async (req, res) => {

    const pregunta = req.query.q;

    const respuesta = await ai.ask(pregunta);

    res.json({
        respuesta
    });

});

// sincroniza tablas postgres
sequelize.sync()
.then(() => {

    console.log("✅ Tablas sincronizadas");

    server.listen(4000, () => {
        console.log("🚀 Aplicación corriendo en puerto 4000");
    });

})
.catch((err) => {
    console.log("❌ Error:", err);
});