import { useEffect, useState } from "react";

// Components
import "./registrarTurno.css";
import RegistrarTurnoCard from "./RegistrarTurnoCard";
import RegistrarTurnoBttnCarrusel from "./RegistrarTurnoBttnCarrusel";

// Data for testing
const Laboratorios = [
  {
    nombre: "Laboratorio 2",
    fecha: "01/01/2021",
    hora: "10:00",
    descripcion: "Descripcion 1",
  },
  {
    nombre: "Laboratorio 3",
    fecha: "01/01/2021",
    hora: "10:00",
    descripcion: "Descripcion 1",
  },
  {
    nombre: "Laboratorio 4",
    fecha: "01/01/2021",
    hora: "10:00",
    descripcion: "Descripcion 1",
  },
  {
    nombre: "Laboratorio 5",
    fecha: "01/01/2021",
    hora: "10:00",
    descripcion: "Descripcion 1",
  },
];

const RegistrarTurno = () => {
  const [Laboratorios, setLaboratorios] = useState([]);
  useEffect(() => {
    setLaboratorios(Laboratorios);
  }, []);
  return (
    <header className="mt-5">
      <div className="container rounded bg-light ">
        <div className="row">
          <div className="col-12 col-md-12 mt-3">
            <h1>Registrar turnos</h1>
            <p>Seleccionar el usuario que accedera</p>
            <div className="col-6">
              {/* <input className="form-control" type="text" placeholder="Usurario" aria-label="default input example"> */}
            </div>
            <h3 className="mt-3">Seleccionar laboratorio</h3>
            <div className="col-sm-8 col-md-12 d-flex justify-content-center me-3 mt-3">
              <div
                id="carouselExampleDark"
                className="carousel carousel-dark slide"
              >
                <div className="carousel-indicators">
                    <RegistrarTurnoBttnCarrusel index={"0"} />
                    <RegistrarTurnoBttnCarrusel index={"1"} />
                  <RegistrarTurnoBttnCarrusel index={"2"} />
                </div>
                <div className="carousel-inner ">
                    {     
                        Laboratorios.map((Laboratorios, index) => (
                        <RegistrarTurnoCard index={index} Laboratorios={Laboratorios} />
                    ))};
                        
                  {/* <RegistrarTurnoCard index={"0"} Laboratorios={Laboratorios}/>
                  <RegistrarTurnoCard index={"1"} Laboratorios={Laboratorios}/>
                  <RegistrarTurnoCard index={"2"} Laboratorios={Laboratorios}/> */}
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleDark"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <h3 className="mt-3">Selecionar fecha y hora</h3>
            <div className="d-flex  p-2">
              {/* <input className="p-2 m-2" type="date"> */}
              {/* <input className="p-2 m-2" type="time"> */}
            </div>
            <div className="row mt-2 ">
              <div className="col-12 col-md-6">
                <button
                  type="button"
                  className="btn btn-success btn-lg  mb-2 w-100"
                >
                  Cancelar turno
                </button>
              </div>
              <div className="col-12 col-md-6 ">
                <button
                  type="button"
                  className="btn btn-primary btn-lg  w-100 mb-2 "
                >
                  Confirmar turno
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default RegistrarTurno;
