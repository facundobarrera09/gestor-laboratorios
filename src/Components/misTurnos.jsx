import { useEffect, useState } from "react";
//Components
import MisTurnosBody from "./MisTurnosBody";
import TurnoActualBody from "./TurnoActualBody";

// Styles

// Data for testing
const data = [
  {
    nombre: "Laboratorio 1",
    fecha: "01/01/2021",
    hora: "10:00",
    descripcion: "Descripcion 1",
  },
];
const dataMisTurnos = [
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

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  useEffect(() => {
    setTurnos(data);
  }, []);
  const [MisTurnos, setMisTurnos] = useState([]);
  useEffect(() => {
    setMisTurnos(dataMisTurnos);
  }, []);

  return (
    <div className="div-principal ">
      <div className="container bg-light rounded my-5">
        <div className="col-12 col-md-12 mt-3">
          <h1 className="mb-3">Turno actual</h1>
          {turnos.map((turnos, index) => (
            <TurnoActualBody index={index} turnos={turnos} />
          ))}
          <h1 className="mt-5">Mis turnos</h1>
          <div className="col-12 col-md-8">
            <div className="row">
              <div className="col-sm-5 col-md-4">
                <button
                  type="button"
                  className="btn btn-success  mt-2 w-100"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  Cancelar turno
                </button>
              </div>
              <div className="col-sm-7 col-md-8">
                <button type="button" className="btn btn-primary mt-2  w-100">
                  Acceder
                </button>
              </div>
            </div>
          </div>
          <div className="row">
              {MisTurnos.map((MisTurnos, index) =>
                (index + 1) % 2 == 0 ? (
                  <MisTurnosBody index={index} MisTurnos={MisTurnos} />
                ) : <MisTurnosBody index={index} MisTurnos={MisTurnos} />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisTurnos;
