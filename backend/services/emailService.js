// backend/emailService.js
const nodemailer = require("nodemailer");

// Configuración con tu cuenta de Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "garfios4444@gmail.com", // ◄--- Pon tu correo aquí
        pass: "hzya goyv mlka qrbc" // ◄--- Pon tu contraseña de aplicación de 16 letras aquí
    }
});

// 1. Correo para el Asesor (Indeciso)
const enviarAlertaAsesor = async (numeroCelular) => {
    const mailOptions = {
        from: '"Farmacia SaludPlus IA" <garfios4444@gmail.com>',
        to: "garfios4444@gmail.com", // Te llegará a ti mismo
        subject: "🚨 CLIENTE INDECISO: Solicita un asesor urgente",
        text: `Hola Richard,\n\nUn cliente en el chat de IA está indeciso y ha dejado su número para que lo contactes.\n\n📞 Número de Celular: ${numeroCelular}\n\nPor favor, comunícate con él lo antes posible.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email enviado: Cliente indeciso");
    } catch (error) {
        console.error("Error al enviar email de asesor:", error);
    }
};

// 2. Correo para pedido de más de 3 productos
const enviarAlertaPedidoGrande = async (historialProductos) => {
    const mailOptions = {
        from: '"Farmacia SaludPlus IA" <garfios4444@gmail.com>',
        to: "garfios4444@gmail.com",
        subject: "📦 ALERTA: Cliente consultando/haciendo pedido grande (IA)",
        text: `Hola Richard,\n\nUn cliente está muy interesado y ha consultado más de 3 productos a través del chat de Inteligencia Artificial.\n\n📋 Productos consultados en esta sesión:\n${historialProductos.join("\n")}\n\nRevisa el sistema de inmediato.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email enviado: Pedido Grande");
    } catch (error) {
        console.error("Error al enviar email de pedido grande:", error);
    }
};

module.exports = { enviarAlertaAsesor, enviarAlertaPedidoGrande };