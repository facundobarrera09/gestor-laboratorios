const RegistrarTurnoBttnCarrusel = ({ index }) => {
  return (
    <button
      type="button"
      data-bs-target="#carouselExampleDark"
      data-bs-slide-to={index}
      class="active"
      aria-current="true"
      aria-label={"Slide " + index}
    ></button>
  );
};

export default RegistrarTurnoBttnCarrusel;
