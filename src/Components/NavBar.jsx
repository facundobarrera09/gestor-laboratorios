import { NavLink } from "react-router-dom";
// Style
import "./style-navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-principal p-0 mb-10">
      <div className="container-fluid">
        <NavLink className="navbar-brand text-white fs-5" to="/">
          Laboratorio Ciasur
        </NavLink>
        <NavLink
          className="navbar navbar-expand-lg color-fondo"
          data-bs-theme="dark"
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link text-white active " to="/">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white " to="/contact">
                    Contacto
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white " to="/misTurnos">
                    Mis Turnos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-white " to="/registrarTurno">
                    Registrar Turnos
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </NavLink>
      </div>
    </nav>
    
  );
};

export default Navbar;
