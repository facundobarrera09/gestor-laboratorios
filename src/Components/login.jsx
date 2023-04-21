// Styles
import "./style-misTurnos.css";
// Componente jquery
import $ from "jquery";
// Componente de react
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login");
    // Crear el objeto JSON
    var login = {
      correo: $("#floatingInput").val(),
      contrasena: $("#floatingPassword").val(),
    };
    var loginString = JSON.stringify(login);
    localStorage.setItem("login", loginString);
    navigate("/misTurnos");
  };
  return (
    <form onSubmit={handleLogin}>
      <div className="div-principal">
        <div className="container-fluid ">
          <div className="row justify-content-center ">
            <div className="col-10 col-sm-6 bg-white rounded my-5 p-5 ">
              <h1 className="text-center p-4">Inicio de sesión</h1>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="Correo"
                ></input>
                <label htmlFor="floatingInput">Correo Electronico</label>
              </div>
              <div className="form-floating ">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                ></input>
                <label htmlFor="floatingPassword">Contraseña</label>
              </div>
              <div className="p-4"></div>
              <div className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg text-center justify-content-center"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
