const RegistrarTurnoCard = ({ index, Laboratorios }) => {
  alert("slide " + index);
  return (
    <div class="carousel-item active">
      <div class="card text-center border-primary mb-3 component">
        <div class="card-body">
          <h5 class="card-title text-primary">laboratorio {index}</h5>
          <p class="card-text">Descripcionasdfsafsafasfasfasf</p>
        </div>
      </div>
    </div>
  );
};



export default RegistrarTurnoCard;
