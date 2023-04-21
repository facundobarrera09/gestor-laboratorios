// Componentes de react
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import NavBar from "./Components/NavBar";
import "./index.css";
import App from "./App";
import MisTurnos from "./Components/misTurnos";
import RegistrarTurno from "./Components/RegistrarTurno";
import SpaceBetweenComponents from "./Components/SpaceBeetwenComponents";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "@popperjs/core/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./Components/style-misTurnos.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <div>
      <body>
        <NavBar />
        <SpaceBetweenComponents />
        <Routes>
          <Route path="/registrarTurno" element={<RegistrarTurno />} />
          <Route path="/" element={<App />} />
          <Route path="*" element={<h1>404: Not Found</h1>} />
          <Route path="/misTurnos" element={<MisTurnos />} />
        </Routes>
      </body>
    </div>
  </BrowserRouter>
);
