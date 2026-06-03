import { useEffect, useState } from "react";
import "./loginPacientes.css";

export default function LoginPacientes() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [especialidad, setEspecialidad] = useState("");

  const [pacientes, setPacientes] = useState([]);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [idPacienteEditando, setIdPacienteEditando] = useState(null);

  // OBTENER PACIENTES
  const obtenerPacientes = async () => {
    try {
      const response = await fetch("http://localhost:3000/pacientes");
      const data = await response.json();
      setPacientes(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  // LIMPIAR
  const limpiarFormulario = () => {
    setNombre("");
    setEdad("");
    setEspecialidad("");
  };

  // GUARDAR
  const guardarPaciente = async () => {
    if (
      nombre.trim() === "" ||
      edad.trim() === "" ||
      especialidad.trim() === ""
    ) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/pacientes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            edad,
            especialidad,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Paciente creado");
        obtenerPacientes();
        limpiarFormulario();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ELIMINAR
  const eliminarPaciente = async (id) => {
    try {
      await fetch(`http://localhost:3000/pacientes/${id}`, {
        method: "DELETE",
      });

      obtenerPacientes();
    } catch (error) {
      console.error(error);
    }
  };

  // EDITAR
  const editarPaciente = (p) => {
    setNombre(p.nombre);
    setEdad(p.edad);
    setEspecialidad(p.especialidad);

    setModoEdicion(true);
    setIdPacienteEditando(p.id);
  };

  // ACTUALIZAR
  const actualizarPaciente = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/pacientes/${idPacienteEditando}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            edad,
            especialidad,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);

      obtenerPacientes();
      cancelarEdicion();
    } catch (error) {
      console.error(error);
    }
  };

  // CANCELAR
  const cancelarEdicion = () => {
    limpiarFormulario();
    setModoEdicion(false);
    setIdPacienteEditando(null);
  };

  return (
    <div className="contenedor">
      <h1>Registro de Pacientes</h1>

      <div className="formulario">
        <h2>
          {modoEdicion ? "Editar Paciente" : "Registrar Paciente"}
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
        />

        <input
          type="text"
          placeholder="Especialidad"
          value={especialidad}
          onChange={(e) => setEspecialidad(e.target.value)}
        />

        <div className="acciones-formulario">
          {modoEdicion ? (
            <>
              <button onClick={actualizarPaciente}>
                Actualizar Paciente
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
              <button onClick={guardarPaciente}>
                Guardar Paciente
              </button>

              <button className="btn-invisible">
                Oculto
              </button>
            </>
          )}
        </div>
      </div>

      <h2 className="titulo-lista">Lista de Pacientes</h2>

      <div className="lista">
        {pacientes.length === 0 ? (
          <p>No hay pacientes registrados</p>
        ) : (
          pacientes.map((p) => (
            <div key={p.id} className="card-paciente">
              <p>
                <strong>Nombre:</strong> {p.nombre}
              </p>

              <p>
                <strong>Edad:</strong> {p.edad}
              </p>

              <p>
                <strong>Especialidad:</strong> {p.especialidad}
              </p>

              <div className="botones">
                <button
                  onClick={() => editarPaciente(p)}
                  className="btn-editar"
                >
                  Editar
                </button>

                <button
                  onClick={() => eliminarPaciente(p.id)}
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