import ChatBot from "./components/ChatBot";
import Catalogo from "./components/Catalogo";
import { useState, useEffect } from "react";
import {Routes,Route,useNavigate,Navigate} from "react-router-dom";
import "./App.css";
import LoginPacientes
from "./components/loginPacientes";
import LoginUsuarios
from "./components/loginUsuario";
import LoginProductos
from "./components/loginProductos";
import RegisterUsuarios
from "./components/registerUsuarios";

function App() {
  const navigate = useNavigate();
  // USER LOCALSTORAGE
  const user =
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  // LOGIN
  const [email, setEmail] =useState("");
  const [password, setPassword] =useState("");

  // SESION
  const [logueado, setLogueado] =
    useState(
      localStorage.getItem("token")
        ? true
        : false
    );

  // DASHBOARD USER
  const [dashboardUser,
    setDashboardUser] =useState(null);

  // LOADING
  const [loading, setLoading] =useState(true);

  // VALIDAR TOKEN
  useEffect(() => {

    const validarToken = async () => {
      const token =
        localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          "http://localhost:3000/dashboard",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );
        const data =await response.json();
        if (response.ok) {
          setDashboardUser(data);
        } else {
          cerrarSesion();
        }
      } catch (error) {
        console.error(error);
        cerrarSesion();
      }
      setLoading(false);
    };
    validarToken();
  }, []);

  // LOGIN
  const iniciarSesion = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =await response.json();

      // LOGIN OK
      if (data.success) {

        // TOKEN
        localStorage.setItem(
          "token",
          data.token
        );

        // USER
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setDashboardUser(data.user);
        setLogueado(true);

        // REDIRECCION SEGUN ROLE
        if (data.user.role === "admin") {
          navigate("/productos");
        } else {
          navigate("/catalogo");
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Error conectando servidor"
      );
    }
  };

  // LOGOUT
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDashboardUser(null);
    setLogueado(false);
    navigate("/");
  };

  // LOADING
  if (loading) {
    return <h1>Cargando...</h1>;
  }

  // LOGIN VIEW
  if (!logueado) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="login-container">
              <div className="login-box">
                <h1>
                  Login
                </h1>
                <input
                  type="email"
                  placeholder="Correo"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button onClick={iniciarSesion}>
                  Ingresar
                </button>

                <button onClick={() => navigate("/register")}>
                  Registrarse
                </button>
              </div>
            </div>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <RegisterUsuarios />
          }
        />
      </Routes>
    );
  }

  // DASHBOARD
  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>
          Bienvenido
          <br />
          {dashboardUser?.email}
        </h2>

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            <button onClick={() => navigate("/productos")}>
              Productos
            </button>
            <button onClick={() => navigate("/pacientes")}>
              Pacientes
            </button>
            <button onClick={() => navigate("/usuarios")}>
              Usuarios
            </button>
          </>
        )}

        {/* USER */}
        {user?.role === "user" && (
          <button onClick={() => navigate("/catalogo")}>
            Ver Productos
          </button>
        )}

        <button onClick={cerrarSesion} style={{ marginTop: 'auto', background: '#ef4444' }}>
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL EN TODA LA PANTALLA */}
      <main className="contenido">
        <div className="contenido-blanco">
          <Routes>
            <Route
              path="/"
              element={
                user?.role === "admin"
                  ? <Navigate to="/productos" />
                  : <Navigate to="/catalogo" />
              }
            />

            {/* ADMIN */}
            <Route
              path="/productos"
              element={
                user?.role === "admin"
                  ? <LoginProductos />
                  : <Navigate to="/catalogo" />
              }
            />
            <Route
              path="/pacientes"
              element={
                user?.role === "admin"
                  ? <LoginPacientes />
                  : <Navigate to="/catalogo" />
              }
            />
            <Route
              path="/usuarios"
              element={
                user?.role === "admin"
                  ? <LoginUsuarios />
                  : <Navigate to="/catalogo" />
              }
            />

            {/* USER */}
            <Route path="/catalogo" element={<Catalogo />} />

            {/* REGISTER */}
            <Route path="/register" element={<RegisterUsuarios />} />
          </Routes>
        </div>
      </main>

      {/* CHATBOT */}
      <ChatBot />

    </div>
  );
}

export default App;