import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterUsuarios() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async () => {
    if (!name || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (data.success) {
        alert("Usuario registrado correctamente");
        navigate("/"); // pa volverrrr
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Error en registro");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Registro</h1>

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

        <button onClick={registrar}>
          Registrarse
        </button>

        <button onClick={() => navigate("/")}>
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}