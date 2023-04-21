const MisTurnosBody = ({ index, MisTurnos }) => {
  return (
    <div className="col-6 mt-3">
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">{MisTurnos.nombre}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">
            {MisTurnos.Fecha} {MisTurnos.hora}
          </h6>
          <p className="card-text">{MisTurnos.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default MisTurnosBody;
