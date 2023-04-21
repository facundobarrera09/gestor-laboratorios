const TurnoActualBody = ({index,turnos}) => {
  return (
    <div className="col-12 col-md-12">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{turnos.nombre}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{turnos.fecha} y {turnos.hora}</h6>
          <p className="card-text">{turnos.descripcion}</p>
        </div>
      </div>
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
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Confirmar
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              ¿Está seguro que desea cancelar el turno?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
              >
                Salir
              </button>
              <button type="button" className="btn btn-primary">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurnoActualBody;