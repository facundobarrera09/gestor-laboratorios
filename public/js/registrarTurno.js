/*global userData */

const loginUrl = 'http://localhost:3001/'
const laboratoriesGetUrl = 'http://localhost:3001/api/laboratories/active-inactive'
const turnsApiUrl = 'http://localhost:3001/api/turns'
const turnsUrl = 'http://localhost:3001/misTurnos.html'

let laboratories

const getTurnTime = (turnDuration, turn) => {
    const startingTimeMinutes = turn*turnDuration

    const hours = Math.floor(startingTimeMinutes / 60)
    const minutes = startingTimeMinutes % 60

    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)

    return date.toTimeString().slice(0,5)
}

const obtenerLabSeleccionado = () => {
    const carouselActivo = document.querySelector('.carousel-item.active')
    return laboratories.find((lab) => lab.id === Number.parseInt(carouselActivo.id))
}

let turnos = []

// Seleccionar fecha y hora.
const fecha = document.getElementById('fecha')
const hora = document.getElementById('hora')

fecha.setAttribute('value', new Date().toISOString().slice(0,10))

const crearListadoTurnos = () => {
    const laboratorioSeleccionado = obtenerLabSeleccionado()

    while (hora.firstChild) {
        hora.removeChild(hora.lastChild)
    }

    const noOption = document.createElement('option')
    noOption.value = ''
    noOption.innerHTML = 'Seleccionar hora'
    hora.appendChild(noOption)

    for (let i of turnos.availableTurns) {
        const option = document.createElement('option')
        option.value = i
        option.innerHTML = getTurnTime(laboratorioSeleccionado.turnDurationMinutes, i)
        hora.appendChild(option)
    }
}

const actualizarListadoTurnos = () => {
    const lab = obtenerLabSeleccionado()
    const date = fecha.value

    hora.disabled = (date === '') ? true : false

    if (!lab)
        return

    if (laboratories) {
        $.ajax({
            url: `${turnsApiUrl}/available/${obtenerLabSeleccionado().id}?date=${date}`,
            headers: { 'Authorization': `Bearer ${userData.access_token}` },
            type: 'GET',
            success: (response) => {
                turnos = response
                crearListadoTurnos()
            }
        })
    }
}

fecha.addEventListener('change', () => {
    actualizarListadoTurnos()
})

const listLab = () => {
    for (let i = 0; i < laboratories.length; i++) {
        const carouselCuerpo = document.getElementById('carousel-cuerpo')
        const carouselItem = document.createElement('div')
        const cardDiv = document.createElement('div')
        const cardBody = document.createElement('div')
        const cardTitle = document.createElement('h5')
        const cardDescription = document.createElement('p')

        // Styles
        if (i === 0) {
            carouselItem.className = 'carousel-item active'
        } else {
            carouselItem.className = 'carousel-item'
        }

        carouselItem.id = laboratories[i].id
        carouselItem.setAttribute('data-interval', 'false')
        cardDiv.className = 'card text-center border-primary w-100 h-100'
        cardBody.className = 'card-body'
        cardTitle.className = 'card-title'
        cardDescription.className = 'card-text'

        // Data
        cardTitle.innerText = laboratories[i].name
        cardDescription.innerText = laboratories[i].description
        carouselCuerpo.appendChild(carouselItem)
        carouselItem.appendChild(cardDiv)
        cardDiv.appendChild(cardBody)
        cardBody.appendChild(cardTitle)
        cardBody.appendChild(cardDescription)
    }
}

$('#laboratoriesCarousel').on('slid.bs.carousel', actualizarListadoTurnos)
window.onload = () => {
    $('#laboratoriesCarousel').carousel('pause')
}

document.getElementById('new-turn').onsubmit = (event) => {
    event.preventDefault()

    const date = new Date(`${fecha.value} 00:00:00`)
    const turn = Number.parseInt(hora.value)
    const laboratoryId = obtenerLabSeleccionado().id

    if (fecha.value === '' || hora.value === '') {
        alert('Debe seleccionar una fecha y hora')
    } else {
        const newTurn = {
            date,
            turn,
            laboratoryId
        }

        if (userData) {
            $.ajax({
                url: turnsApiUrl,
                headers: {
                    'Authorization': `Bearer ${userData.access_token}`,
                    'Content-Type': 'application/json'
                },
                type: 'POST',
                data: JSON.stringify(newTurn),
                success: () => {
                    localStorage.setItem('notify', 'El turno fue creado con éxito')
                    window.location.assign(turnsUrl)
                },
                error: (error) => {
                    console.log(error)
                }
            })
        }
        else {
            window.location.assign(loginUrl)
        }
    }
}

if (userData) {
    $.ajax({
        url: laboratoriesGetUrl,
        headers: { 'Authorization': `Bearer ${userData.access_token}` },
        type: 'GET',
        success: (response) => {
            laboratories = response
            listLab()
            actualizarListadoTurnos()
        },
        error: (error) => {
            console.log(error)
        }
    })
}