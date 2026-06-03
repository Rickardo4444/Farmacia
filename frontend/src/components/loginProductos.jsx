import { useEffect, useState } from "react";

import "./loginPacientes.css";

export default function LoginProductos() {

  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [lote, setLote] = useState("");

  const [productos, setProductos] = useState([]);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [idProductoEditando,
    setIdProductoEditando] =
    useState(null);

  // OBTENER PRODUCTOS
  const obtenerProductos = async () => {

    try {

      const response = await fetch(
        "http://localhost:3000/products"
      );

      const data = await response.json();

      setProductos(data.data);

    } catch (error) {

      console.error(error);

    }

  };

  // CARGAR PRODUCTOS
  useEffect(() => {

    obtenerProductos();

  }, []);

  // LIMPIAR
  const limpiarFormulario = () => {

    setNombre("");
    setCategoria("");
    setPrecio("");
    setStock("");
    setProveedor("");
    setLote("");

  };

  // GUARDAR
  const guardarProducto = async () => {

    if (
      nombre.trim() === "" ||
      categoria.trim() === "" ||
      precio.trim() === "" ||
      stock.trim() === "" ||
      proveedor.trim() === "" ||
      lote.trim() === ""
    ) {

      alert("Completa todos los campos");

      return;

    }

    try {

      const response = await fetch(
        "http://localhost:3000/products",
        {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            nombre,
            categoria,
            precio,
            stock,
            proveedor,
            lote

          })

        }
      );

      const data = await response.json();

      if (data.success) {

        alert("Producto creado");

        obtenerProductos();

        limpiarFormulario();

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.error(error);

    }

  };

  // ELIMINAR
  const eliminarProducto = async (id) => {

    try {

      await fetch(
        `http://localhost:3000/products/${id}`,
        {

          method: "DELETE"

        }
      );

      obtenerProductos();

    } catch (error) {

      console.error(error);

    }

  };

  // EDITAR
  const editarProducto = (p) => {

    setNombre(p.nombre);
    setCategoria(p.categoria);
    setPrecio(p.precio);
    setStock(p.stock);
    setProveedor(p.proveedor);
    setLote(p.lote);

    setModoEdicion(true);

    setIdProductoEditando(p.id);

  };

  // ACTUALIZAR
  const actualizarProducto = async () => {

    try {

      const response = await fetch(
        `http://localhost:3000/products/${idProductoEditando}`,
        {

          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            nombre,
            categoria,
            precio,
            stock,
            proveedor,
            lote

          })

        }
      );

      const data = await response.json();

      alert(data.message);

      obtenerProductos();

      cancelarEdicion();

    } catch (error) {

      console.error(error);

    }

  };

  // CANCELAR
  const cancelarEdicion = () => {

    limpiarFormulario();

    setModoEdicion(false);

    setIdProductoEditando(null);

  };

  return (

    <div className="contenedor">

      <h1>Registro de Productos</h1>

      <div className="formulario">

        <h2>
          {modoEdicion
            ? "Editar Producto"
            : "Registrar Producto"}
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) =>
            setPrecio(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Proveedor"
          value={proveedor}
          onChange={(e) =>
            setProveedor(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Lote"
          value={lote}
          onChange={(e) =>
            setLote(e.target.value)
          }
        />

        <div className="acciones-formulario">

          {modoEdicion ? (

            <>

              <button
                onClick={actualizarProducto}
              >
                Actualizar Producto
              </button>

              <button
                onClick={cancelarEdicion}
                className="btn-cancelar"
              >
                Cancelar
              </button>

            </>

          ) : (

            <>

              <button
                onClick={guardarProducto}
              >
                Guardar Producto
              </button>

              <button className="btn-invisible">
                Oculto
              </button>

            </>

          )}

        </div>

      </div>

      <h2 className="titulo-lista">
        Lista de Productos
      </h2>

      <div className="lista">

        {productos.length === 0 ? (

          <p>No hay productos registrados</p>

        ) : (

          productos.map((p) => (

            <div
              key={p.id}
              className="card-paciente"
            >

              <p>
                <strong>Nombre:</strong>
                {" "}
                {p.nombre}
              </p>

              <p>
                <strong>Categoría:</strong>
                {" "}
                {p.categoria}
              </p>

              <p>
                <strong>Precio:</strong>
                {" "}
                S/ {p.precio}
              </p>

              <p>
                <strong>Stock:</strong>
                {" "}
                {p.stock}
              </p>

              <p>
                <strong>Proveedor:</strong>
                {" "}
                {p.proveedor}
              </p>

              <p>
                <strong>Lote:</strong>
                {" "}
                {p.lote}
              </p>

              <div className="botones">

                <button
                  onClick={() =>
                    editarProducto(p)
                  }
                  className="btn-editar"
                >
                  Editar
                </button>

                <button
                  onClick={() =>
                    eliminarProducto(p.id)
                  }
                  className="btn-eliminar"
                >
                  Eliminar
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </div>

  );

}