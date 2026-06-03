import { useEffect, useState } from "react";
import "./loginPacientes.css";

export default function LoginUsuarios() {

  // ESTADOS
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usuarios, setUsuarios] = useState([]);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [idUsuarioEditando, setIdUsuarioEditando] = useState(null);

  // OBTENER USUARIOS
  const obtenerUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      const data = await response.json();
      setUsuarios(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // LIMPIAR
  const limpiarFormulario = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  // GUARDAR
  const guardarUsuario = async () => {

    if (!name || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (data.success) {
        alert("Usuario creado");
        obtenerUsuarios();
        limpiarFormulario();
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
    }
  };

  // ELIMINAR
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro de eliminar este usuario?"
    );
    if (!confirmDelete) return;
    try {
      const response = await fetch(
        `http://localhost:3000/users/${id}`,
        {
          method: "DELETE"
        }
      );
      const data = await response.json();
      alert(data.message);
      obtenerUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  // EDITAR
  const editarUsuario = (u) => {
    setName(u.name);
    setEmail(u.email);
    setPassword("");
    setModoEdicion(true);
    setIdUsuarioEditando(u.id);
  };

  // ACTUALIZAR
  const actualizarUsuario = async () => {

    try {
      const response = await fetch(
        `http://localhost:3000/users/${idUsuarioEditando}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name, email, password })
        }
      );

      const data = await response.json();

      alert(data.message);

      obtenerUsuarios();
      cancelarEdicion();

    } catch (error) {
      console.error(error);
    }
  };

  // CANCELAR
  const cancelarEdicion = () => {
    limpiarFormulario();
    setModoEdicion(false);
    setIdUsuarioEditando(null);
  };

  return (
    <div className="contenedor">

      <h1>Registro de Usuarios</h1>

      {/* FORMULARIO */}
      <div className="formulario">

        <h2>
          {modoEdicion ? "Editar Usuario" : "Registrar Usuario"}
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="acciones-formulario">

          {modoEdicion ? (
            <>
              <button onClick={actualizarUsuario}>
                Actualizar Usuario
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
              <button onClick={guardarUsuario}>
                Guardar Usuario
              </button>
            </>
          )}

        </div>

      </div>

      {/* LISTA */}
      <h2 className="titulo-lista">Lista de Usuarios</h2>

      <div className="lista">

        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados</p>
        ) : (
          usuarios.map((u) => (
            <div key={u.id} className="card-paciente">

              <p>
                <strong>Nombre:</strong> {u.name}
              </p>

              <p>
                <strong>Correo:</strong> {u.email}
              </p>

              <div className="botones">

                <button
                  onClick={() => editarUsuario(u)}
                  className="btn-editar"
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteUser(u.id)}
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