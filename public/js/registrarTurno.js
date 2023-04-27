
let userData = JSON.parse(localStorage.getItem('userLoginData'))

const laboratoriesGetUrl = 'http://localhost:3001/api/laboratories/active-inactive'
const turnGetUrl = 'http://localhost:3001/api/turns'

let laboratories

// carousel
const carousel = document.getElementById("carouselExampleIndicators");

const buttonPrevNext = () => {
  // Button Prev
  let buttonPrev = document.createElement("button");
  buttonPrev.classList.add("carousel-control-prev");
  buttonPrev.setAttribute("type", "button");
  buttonPrev.setAttribute("data-bs-target", "#carouselExampleIndicators");
  buttonPrev.setAttribute("data-bs-slide", "prev");

  let iconPrev = document.createElement("span");
  iconPrev.classList.add("carousel-control-prev-icon");
  iconPrev.setAttribute("aria-hidden", "true");

  let labelPrev = document.createElement("span");
  labelPrev.classList.add("visually-hidden");
  labelPrev.textContent = "Previous";

  buttonPrev.appendChild(iconPrev);
  buttonPrev.appendChild(labelPrev);

  // Button Next

  let buttonNext = document.createElement("button");
  buttonNext.classList.add("carousel-control-next");
  buttonNext.setAttribute("type", "button");
  buttonNext.setAttribute("data-bs-target", "#carouselExampleIndicators");
  buttonNext.setAttribute("data-bs-slide", "next");

  let iconNext = document.createElement("span");
  iconNext.classList.add("carousel-control-next-icon");
  iconNext.setAttribute("aria-hidden", "true");

  let labelNext = document.createElement("span");
  labelNext.classList.add("visually-hidden");
  labelNext.textContent = "Next";

  buttonNext.appendChild(iconNext);
  buttonNext.appendChild(labelNext);

  carousel.appendChild(buttonPrev);
  carousel.appendChild(buttonNext);
};

const buttonCarusel = () => {
  buttonPrevNext();
  for (let i = 0; i < laboratories.length; i++) {
    let parseI = i.toString();
    const carouselIndicators = document.getElementById("carousel-Indicators");
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-target", "#carouselExampleIndicators");
    button.setAttribute("data-bs-slide-to", parseI);
    if (i == 0) {
      button.classList.add("active");
      button.setAttribute("aria-current", "true");
    }
    button.setAttribute("aria-label", "Slide " + parseI);
    carouselIndicators.appendChild(button);
  }
};

const listLab = () => {
  buttonCarusel();
  for (let i = 0; i < laboratories.length; i++) {
    const CarouselCuerpo = document.getElementById("carousel-cuerpo");
    const carouselItem = document.createElement("div");
    const cardDiv = document.createElement("div");
    const cardBody = document.createElement("div");
    const cardTitle = document.createElement("h5");
    const cardDescription = document.createElement("p");

    // Styles
    if (i == 0) {
      carouselItem.className = "carousel-item active";
    } else {
      carouselItem.className = "carousel-item";
    }

    cardDiv.className = "card text-center border-primary mb-3 w-100 h-100";
    cardBody.className = "card-body";
    cardTitle.className = "card-title";
    cardDescription.className = "card-text";

    // Data
    cardTitle.innerText = laboratories[i].name;
    cardDescription.innerText = laboratories[i].description;
    CarouselCuerpo.appendChild(carouselItem);
    carouselItem.appendChild(cardDiv);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardDescription);
  }
};

if (userData) {
  $.ajax({
    url: laboratoriesGetUrl,
    headers: { "Authorization": `Bearer ${userData.token}` },
    type: 'GET',
    'async': false,
    success: (response) => {
      laboratories = response
      listLab();
    },
    error: (error) => {
      console.log(error)
    }
  })
}

// Data de prueba para los turnos

// Teniendo en cuenta que me van a enviar un numero por cada horario, siendo 0 -> 00:00 y 1 -> 00:10
let dataTurno = [];

if (userData) {
}

const generarDatosTurno = () => {
  for (let i = 0; i < 144; i++) {
    let dataObject = {};
    if (i == 4) {
      dataObject = {
        name: "Laboratorio de Prueba1",
        turnDurationMinutes: i.toString(),
        state: "inactive",
        date: "2021-10-10",
      };
    } else {
      dataObject = {
        name: "Laboratorio de Prueba1",
        turnDurationMinutes: i.toString(),
        state: "active",
        date: "2021-10-10",
      };
    }

    dataTurno.push(dataObject);
  }
}

console.log(dataTurno);

const listHours = document.getElementById("hora");
let turnDurationMinutes = 0;

const crearListado = () => {
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 6; j++) {
      if (dataTurno[turnDurationMinutes].state == "inactive") {
        // Si el turno esta inactivo, no lo muestro
      } else {
        const option = document.createElement("option");
        if (i < 10) {
          option.value = turnDurationMinutes; // Cambio el valor de la opcion para que sea el mismo que el de la data
          if (j == 0) {
            option.textContent = "0" + i + ":00";
          } else {
            option.textContent = "0" + i + ":" + j + "0";
          }
          listHours.appendChild(option);
        } else {
          option.value = turnDurationMinutes; // Cambio el valor de la opcion para que sea el mismo que el de la data
          if (j == 0) {
            option.textContent = i + ":00";
          }
          option.textContent = i + ":" + j + "0";
          listHours.appendChild(option);
        }
      }
      turnDurationMinutes++;
    }
  }
}

// Seleccionar fecha y hora.
const fecha = document.getElementById("fecha");
const hora = document.getElementById("hora");

fecha.addEventListener("change", () => {

  if (laboratories) {
    $.ajax({
      url: `${turnGetUrl}/available/${labId}`,
      headers: { "Authorization": `Bearer ${userData.token}` },
      type: 'GET',
      success: (response) => {
        dataTurno = response
        crearListado()
      }
    })
  }

  hora.removeAttribute("disabled");
});

// Registrar turno
const registrarTurno = document.getElementById("registrarTurno");
// Obtenemos el carousel activo
const carouselActivo = document.querySelector(".active");
let carouselSeleccionado = carouselActivo.getAttribute("aria-label");
// Tener en cuenta que el slide 0 pertenece al lab 1, el slide 1 al lab 2, etc.

registrarTurno.addEventListener("click", () => {
  if (fecha.value == "" || hora.value == "") {
    alert("Debe seleccionar una fecha y hora");
  } else {
    alert("El valor de la fecha es " + fecha.value);
    alert("El valor de la hora es " + hora.value);
    alert("El valor del carousel seleccionado es "+ carouselSeleccionado);
  }
});
