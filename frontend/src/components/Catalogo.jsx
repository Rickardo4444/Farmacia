// src/components/Catalogo.jsx
import { useEffect, useState } from "react";
import "./loginPacientes.css"; 

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [boletaFinal, setBoletaFinal] = useState(null);
  const [alertaEnviada, setAlertaEnviada] = useState(false);

  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      
      const productosConCantidad = (data.data || []).map(p => ({
        ...p,
        cantidadSeleccionada: 1
      }));
      
      setProductos(productosConCantidad);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const manejarCantidadChange = (id, valor) => {
    const nuevaCantidad = Math.max(1, parseInt(valor) || 1);
    setProductos(productos.map(p => 
      p.id === id ? { ...p, cantidadSeleccionada: nuevaCantidad } : p
    ));
  };

  // Función principal para meter cosas al carrito
  const agregarAlCarrito = (producto, cantidadDesdeIA = null) => {
    const cantidadAñadir = cantidadDesdeIA || producto.cantidadSeleccionada || 1;

    if (producto.stock <= 0) {
      alert(`Lo siento, ${producto.nombre} se encuentra agotado.`);
      return false;
    }
    if (cantidadAñadir > producto.stock) {
      alert(`Stock insuficiente. Solo quedan ${producto.stock} unidades.`);
      return false;
    }

    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
      const nuevaCantidadTotal = existe.cantidad + cantidadAñadir;
      if (nuevaCantidadTotal > producto.stock) {
        alert(`El total en carrito supera las unidades disponibles.`);
        return false;
      }
      setCarrito(carrito.map(item =>
        item.id === producto.id ? { ...item, density: undefined, cantidad: nuevaCantidadTotal } : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: cantidadAñadir }]);
    }
    return true;
  };

  // 🌟 HACEMOS LA FUNCIÓN ACCESIBLE PARA EL CHATBOT DE IA
  useEffect(() => {
    window.agregarAlCarritoDesdeIA = (prod) => {
      // Forzamos cantidad 1 cuando se agrega desde el Chat de IA rápido
      return agregarAlCarrito(prod, 1);
    };
  }, [carrito]);

  // 🚨 DETECTOR AUTOMÁTICO: Monitorea si el carrito supera los 3 productos/unidades para enviar correo
  useEffect(() => {
    const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Si el carrito acumulado tiene más de 3 unidades o más de 3 ítems diferentes
    if ((carrito.length > 3 || totalUnidades > 3) && !alertaEnviada) {
      setAlertaEnviada(true);

      // Preparamos el resumen de la compra actual
      const resumenProductos = carrito.map(item => 
        `- ${item.nombre} | Cantidad: ${item.cantidad} | Precio unitario: S/ ${item.precio}`
      );

      // Desparamos el fetch al backend para enviarte el correo de alerta
      fetch("http://localhost:3000/iaProducts/alerta-pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos: resumenProductos })
      })
      .then(res => res.json())
      .then(data => console.log("🚨 Alerta de compra grande enviada al correo de Richard:", data))
      .catch(err => console.error("Error enviando alerta de correo:", err));
    }

    // Si el carrito se vacía del todo (por procesamiento), reiniciamos el gatillo de alertas
    if (carrito.length === 0) {
      setAlertaEnviada(false);
    }
  }, [carrito, alertaEnviada]);

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const procesarCompra = () => {
    if (carrito.length === 0) return;

    const subtotal = carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);
    const igv = subtotal * 0.18;
    const total = subtotal;
    const valorNeto = subtotal - igv;

    setBoletaFinal({
      numeroBoleta: `BV-${Math.floor(100000 + Math.random() * 900000)}`,
      fecha: new Date().toLocaleString(),
      items: [...carrito],
      valorNeto: valorNeto.toFixed(2),
      igv: igv.toFixed(2),
      total: total.toFixed(2)
    });

    setCarrito([]);
    setMostrarTicket(true);
  };

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', padding: '20px' }}>
      
      <h1 style={{ color: '#1f2937', marginBottom: '20px', fontWeight: '700', fontSize: '24px' }}>
        Catálogo de Productos
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.9fr) 1.1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* GRILLA DE PRODUCTOS */}
        <div>
          {productos.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No hay productos disponibles.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '15px' }}>
              {productos.map((p) => (
                <div 
                  key={p.id} 
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '10px', 
                    padding: '15px', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    width: '100%',
                    position: 'relative'
                  }}
                >
                  <div>
                    <span style={{ display: 'inline-block', background: '#f3f4f6', color: '#4b5563', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', marginBottom: '8px' }}>
                      {p.categoria || "FARMACIA"}
                    </span>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#111827', fontWeight: '600', minHeight: '38px', lineBreak: 'anywhere' }}>
                      {p.nombre}
                    </h4>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: '#059669', margin: '5px 0' }}>
                      S/ {parseFloat(p.precio).toFixed(2)}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                      Stock: <span style={{ color: p.stock === 0 ? '#ef4444' : '#1f2937', fontWeight: '600' }}>{p.stock === 0 ? "Agotado" : `${p.stock} und.`}</span>
                    </p>
                  </div>

                  <div style={{ marginTop: '12px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                    {p.stock > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#4b5563' }}>Cant:</span>
                        <input 
                          type="number" 
                          min="1" 
                          max={p.stock}
                          value={p.cantidadSeleccionada}
                          onChange={(e) => manejarCantidadChange(p.id, e.target.value)}
                          style={{ width: '50px', padding: '4px', borderRadius: '4px', border: '1px solid #d1d5db', textAlign: 'center', fontSize: '12px' }}
                        />
                      </div>
                    )}
                    
                    <button
                      onClick={() => agregarAlCarrito(p)}
                      disabled={p.stock === 0}
                      style={{
                        width: "100%",
                        padding: "8px",
                        background: p.stock === 0 ? "#9ca3af" : "#28a745",
                        border: "none",
                        color: "white",
                        borderRadius: '6px',
                        cursor: p.stock === 0 ? "not-allowed" : "pointer",
                        fontWeight: "600",
                        fontSize: '12px'
                      }}
                    >
                      {p.stock === 0 ? "Agotado" : "🛒 Agregar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR INTERNO DEL CARRITO */}
        <div style={{ border: '1px solid #e5e7eb', padding: '15px', borderRadius: '10px', backgroundColor: '#f9fafb' }}>
          <h3 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #f3f4f6', paddingBottom: '5px', fontSize: '16px', color: '#111827' }}>
            🛒 Carrito de Compras
          </h3>
          {carrito.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '15px 0' }}>Vacío.</p>
          ) : (
            <>
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
                {carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: '13px' }}>
                    <div style={{ maxWidth: '65%' }}>
                      <p style={{ margin: 0, fontWeight: '600' }}>{item.nombre}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>{item.cantidad} x S/ {parseFloat(item.precio).toFixed(2)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ fontWeight: '600' }}>S/ {(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
                      <button onClick={() => eliminarDelCarrito(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '14px', marginBottom: '10px' }}>
                  <span>Total:</span>
                  <span style={{ color: '#059669' }}>S/ {carrito.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0).toFixed(2)}</span>
                </div>
                <button onClick={procesarCompra} style={{ width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  Generar Comprobante
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      {/* BOLETA MODAL */}
      {mostrarTicket && boletaFinal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#fff', width: '340px', padding: '25px', fontFamily: '"Courier New", Courier, monospace', color: '#000' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #000', paddingBottom: '10px', marginBottom: '10px' }}>
              <h3 style={{ margin: '0' }}>FARMACIA SALUDPLUS</h3>
              <p style={{ margin: '2px 0', fontSize: '12px' }}>R.U.C. N° 20123456789</p>
              <p style={{ margin: '10px 0 2px 0', fontWeight: 'bold' }}>BOLETA ELECTRÓNICA</p>
              <p style={{ margin: '2px 0' }}>{boletaFinal.numeroBoleta}</p>
            </div>
            <div style={{ fontSize: '12px', marginBottom: '10px' }}>
              {boletaFinal.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>S/ {(parseFloat(item.precio) * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px dashed #000', paddingTop: '8px', fontSize: '12px', textAlign: 'right' }}>
              <p style={{ margin: '3px 0' }}>I.G.V. (18%): S/ {boletaFinal.igv}</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold' }}>TOTAL: S/ {boletaFinal.total}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', fontFamily: 'Arial' }}>
              <button onClick={() => alert('Imprimiendo...')} style={{ flex: 1, padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Imprimir</button>
              <button onClick={() => setMostrarTicket(false)} style={{ flex: 1, padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}