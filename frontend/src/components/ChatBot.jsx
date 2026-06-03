// src/components/ChatBot.jsx
import { useState } from "react";
import axios from "axios";

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Guardaremos una lista de productos únicos consultados en la sesión
    const [productosConsultados, setProductosConsultados] = useState([]);
    const [alertaGrandeEnviada, setAlertaGrandeEnviada] = useState(false);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hola 👋 Soy el asistente virtual de Farmacia SaludPlus. ¿En qué puedo ayudarte?"
        }
    ]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            const userMessage = message;
            const newMessages = [
                ...messages,
                { sender: "user", text: userMessage }
            ];

            setMessages(newMessages);
            setMessage("");
            setLoading(true);

            // Petición al backend
            const res = await axios.get("http://localhost:3000/iaProducts", {
                params: { q: userMessage }
            });

            console.log(res.data);

            const { respuesta, infoProducto } = res.data;

            // Verificar si hay producto y si tiene stock
            let productoData = null;
            if (infoProducto && infoProducto.stock > 0) {
                productoData = infoProducto;

                // Lógica de contar productos únicos
                if (!productosConsultados.includes(infoProducto.nombre)) {
                    const listaActualizada = [...productosConsultados, infoProducto.nombre];
                    setProductosConsultados(listaActualizada);

                    // Si llega a más de 3 productos y no se ha enviado email aún, disparar alerta
                    if (listaActualizada.length > 3 && !alertaGrandeEnviada) {
                        setAlertaGrandeEnviada(true);
                        axios.post("http://localhost:3000/iaProducts/alerta-pedido", {
                            productos: listaActualizada
                        }).then(() => console.log("Alerta de pedido grande enviada"))
                          .catch(err => console.error(err));
                    }
                }
            }

            // Guardamos la respuesta inyectándole la data interactiva si aplica
            setMessages([
                ...newMessages,
                {
                    id: Date.now(),
                    sender: "bot",
                    text: respuesta || "No pude responder.",
                    producto: productoData, // Viene con id, nombre, precio, stock
                    mostrarOpciones: !!productoData // Si hay stock, activa las opciones
                }
            ]);

        } catch (error) {
            console.log(error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "❌ Error conectando con la IA" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Función para procesar la acción de agregar al carrito real del Catálogo
    const handleAgregarCarrito = (prod) => {
        if (window.agregarAlCarritoDesdeIA) {
            // Ejecutamos la inserción en el estado compartido del carrito
            const exito = window.agregarAlCarritoDesdeIA(prod);
            if (exito) {
                alert(`🛒 Añadido al Carrito Principal:\n${prod.nombre} ha sido agregado exitosamente.`);
            }
        } else {
            alert("Error: El catálogo de compras no se ha inicializado correctamente.");
        }
    };

    // Función para activar el formulario de celular de un mensaje específico
    const mostrarFormAsesor = (idMensaje) => {
        setMessages(prev => prev.map(m => 
            m.id === idMensaje ? { ...m, verInputCelular: true } : m
        ));
    };

    // Enviar celular al backend
    const handleEnviarCelular = async (idMensaje, celular) => {
        if (!celular || celular.trim().length < 9) {
            alert("Por favor ingresa un número de celular válido.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/iaProducts/contacto-asesor", { celular });
            
            // Cambiamos el estado del mensaje para confirmar el envío
            setMessages(prev => prev.map(m => 
                m.id === idMensaje 
                    ? { ...m, verInputCelular: false, mostrarOpciones: false, text: m.text + "\n\n✅ Tu número ha sido enviado. Un asesor te escribirá pronto." } 
                    : m
            ));
        } catch (error) {
            alert("Error al enviar el celular al servidor.");
        }
    };

    return (
        <>
            {/* BOTON FLOTANTE */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed", bottom: "20px", right: "20px",
                    width: "65px", height: "65px", borderRadius: "50%",
                    border: "none", background: "#2952c3", color: "white",
                    fontSize: "28px", cursor: "pointer", zIndex: 9999,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)", transition: "0.3s"
                }}
            >
                {open ? "✖" : "🤖"}
            </button>

            {/* CHAT */}
            {open && (
                <div
                    style={{
                        position: "fixed", bottom: "95px", right: "20px",
                        width: "370px", height: "550px", background: "#ffffff",
                        borderRadius: "20px", overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.25)", zIndex: 9999,
                        display: "flex", flexDirection: "column"
                    }}
                >
                    {/* HEADER */}
                    <div style={{ background: "#2952c3", color: "white", padding: "18px", fontWeight: "bold", fontSize: "20px", textAlign: "center" }}>
                        🤖 Farmacia IA
                    </div>

                    {/* MENSAJES */}
                    <div style={{ flex: 1, padding: "15px", overflowY: "auto", background: "#f5f7fb", display: "flex", flexDirection: "column" }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex", flexDirection: "column",
                                    alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                                    marginBottom: "12px"
                                }}
                            >
                                <div
                                    style={{
                                        background: msg.sender === "user" ? "#2952c3" : "#e9eaee",
                                        color: msg.sender === "user" ? "white" : "#222",
                                        padding: "12px 16px", borderRadius: "16px",
                                        maxWidth: "85%", wordWrap: "break-word",
                                        fontSize: "15px", lineHeight: "1.5"
                                    }}
                                >
                                    {msg.text}

                                    {/* BLOQUE INTERACTIVO DINÁMICO */}
                                    {msg.mostrarOpciones && msg.producto && (
                                        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed #bbb", color: "#333" }}>
                                            <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "6px" }}>¿Estás interesado?</p>
                                            
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                                                <span style={{ fontSize: "11px", background: "#d1fae5", color: "#065f46", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold" }}>
                                                    Stock: {msg.producto.stock} u.
                                                </span>
                                                <button 
                                                    onClick={() => handleAgregarCarrito(msg.producto)}
                                                    style={{ background: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}
                                                >
                                                    🛒 Agregar
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => mostrarFormAsesor(msg.id)}
                                                style={{ background: "#f3f4f6", color: "#4f46e5", border: "1px solid #dee2e6", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", fontWeight: "bold", width: "100%" }}
                                            >
                                                🤔 ¿Indeciso? Contactar asesor
                                            </button>
                                        </div>
                                    )}

                                    {/* FORMULARIO DE INGRESO DE CELULAR */}
                                    {msg.verInputCelular && (
                                        <div style={{ marginTop: "10px", display: "flex", gap: "5px" }}>
                                            <input 
                                                type="text" 
                                                placeholder="Tu celular..." 
                                                id={`input-cel-${msg.id}`}
                                                style={{ width: "100%", padding: "6px", fontSize: "12px", border: "1px solid #ccc", borderRadius: "4px" }}
                                            />
                                            <button 
                                                onClick={() => {
                                                    const val = document.getElementById(`input-cel-${msg.id}`).value;
                                                    handleEnviarCelular(msg.id, val);
                                                }}
                                                style={{ background: "#2952c3", color: "white", border: "none", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}
                                            >
                                                Enviar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div style={{ background: "#e4e6eb", padding: "10px 14px", borderRadius: "14px", fontSize: "14px" }}>
                                    Escribiendo...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* INPUT GRANDE INFERIOR */}
                    <div style={{ display: "flex", alignItems: "center", padding: "12px", borderTop: "1px solid #ddd", background: "white", gap: "10px" }}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                            placeholder="Escribe tu mensaje..."
                            style={{ flex: 1, height: "45px", padding: "0 15px", borderRadius: "12px", border: "1px solid #d6d6d6", outline: "none", fontSize: "15px", background: "#f9f9f9" }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            style={{ width: "45px", height: "45px", border: "none", borderRadius: "12px", background: "#2952c3", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "16px", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}