const axios = require("axios");

class AIService {

    constructor() {

        this.history = [];

    }

    async ask(message) {

        try {

            // guardar mensaje usuario
            this.history.push({
                role: "user",
                content: message
            });

            // limitar memoria
            if(this.history.length > 12){
                this.history.shift();
            }

            // contexto farmacia
            const systemPrompt = `
            Eres el asistente virtual oficial de Farmacia SaludPlus.

            Tu función es:
            - ayudar clientes
            - recomendar productos básicos
            - responder dudas sobre la farmacia
            - explicar qué vende la página
            - actuar como vendedor amable

            La farmacia vende:
            - medicamentos
            - vitaminas
            - productos de salud
            - jarabes
            - cuidado personal
            - primeros auxilios

            Reglas:
            - responde corto y claro
            - responde de forma amable y profesional
            - usa lenguaje sencillo
            - no inventes productos
            - no hables de temas fuera de farmacia
            - si no sabes algo, dilo amablemente

            Tu personalidad:
            - amable
            - rápida
            - profesional
            - servicial
            - moderna

            Ejemplos:

            Usuario: hola
            Asistente: Hola 😊 Bienvenido a Farmacia SaludPlus. ¿En qué puedo ayudarte?

            Usuario: ¿Qué venden?
            Asistente: Contamos con medicamentos, vitaminas, productos de salud y cuidado personal.

            Usuario: gracias
            Asistente: Con gusto 😊
            `;

            // construir conversación
            let fullPrompt = systemPrompt + "\n";

            this.history.forEach(msg => {

                fullPrompt += `
                ${msg.role}: ${msg.content}
                `;

            });

            const response = await axios.post(
                "http://localhost:11434/api/generate",
                {
                    model: "tinyllama",//ollama run tinyllama
                    //model: "phi3", //ollama run phi3
                    prompt: fullPrompt,
                    stream: false
                }
            );

            // guardar respuesta IA
            this.history.push({
                role: "assistant",
                content: response.data.response
            });

            return response.data.response;

        } catch(error){

            console.log(error);

            return "Error con IA";

        }

    }

}

module.exports = AIService;
