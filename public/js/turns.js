const loginPageUrl = '/'
const createTurnUrl = '/registrarTurno.html'
const labRedirectUrl = '/redireccion.html'
const laboratoriesGetUrl = 'http://localhost:3001/api/laboratories/active-inactive'
const turnsGetAll = 'http://localhost:3001/api/turns'

let userData = JSON.parse(window.localStorage.getItem('userLoginData'))
if (!userData) {
    window.location.replace(loginPageUrl)
}

let turns = []
let pastTurns = []
let currentTurn
let nextTurn
let futureTurns = []

let laboratories = {}

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

const updateNextTurn = () => {
    const container = document.getElementById('turno-actual-container')
    const title = document.getElementById('turno-actual-titulo')
    const lab = document.getElementById('turno-actual-lab')
    const date = document.getElementById('turno-actual-fecha')
    const desc = document.getElementById('turno-actual-descripcion')

    const turn = currentTurn ? currentTurn : nextTurn

    if (!(turn === undefined)) {
        const turnDate = new Date(turn.date)
        let dateString = `${turnDate.getDate()}/${turnDate.getMonth()+1}/${turnDate.getFullYear()}`

        container.style.display = 'block'
        title.innerText = currentTurn ? 'Turno actual' : 'Turno próximo'
        lab.innerText = laboratories[turn.laboratoryId].name
        date.innerText = dateString + ' ' + getTurnTime(laboratories[turn.laboratoryId].turnDurationMinutes, turn.turn)
        desc.innerHTML = laboratories[turn.laboratoryId].description ? laboratories[turn.laboratoryId].description : 'Sin descripción'
    }
    else {
        container.style.display = 'none'
    }
}

const updateTurns = () => {
    let turnElements = []

    updateNextTurn()

    const turnsArray = (currentTurn && nextTurn) ? [nextTurn, ...futureTurns] : futureTurns
    // const turnsArray = turns

    const listContainer = document.getElementById('all-turns-list')
    if (listContainer) {
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.lastChild)
        }
    }

    for (const turn of turnsArray) {
        const cardDiv = document.createElement('div')
        const cardBodyDiv = document.createElement('div')
        const cardTitle = document.createElement('h5')
        const cardSubtitle = document.createElement('h6')
        const cardText = document.createElement('p')

        cardDiv.className = 'card mb-3'
        cardBodyDiv.className = 'card-body'
        cardTitle.className = 'card-title'
        cardSubtitle.className = 'card-subtitle mb-2 text-body-secondary'
        cardText.className = 'card-text'

        const date = new Date(turn.date)
        let dateString = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`

        cardTitle.innerText = laboratories[turn.laboratoryId].name
        cardSubtitle.innerText = dateString + ', ' + getTurnTime(laboratories[turn.laboratoryId].turnDurationMinutes, turn.turn)
        cardText.innerText = laboratories[turn.laboratoryId].description ? laboratories[turn.laboratoryId].description : 'Sin descripción'

        cardDiv.appendChild(cardBodyDiv)
        cardBodyDiv.appendChild(cardTitle)
        cardBodyDiv.appendChild(cardSubtitle)
        cardBodyDiv.appendChild(cardText)

        turnElements.push(cardDiv)
    }

    const col1Div = document.createElement('div')
    const col2Div = document.createElement('div')
    col1Div.className = 'col-12 col-md-6 mt-3'
    col2Div.className = 'col-12 col-md-6 mt-3'

    let position = 1
    for (const element of turnElements) {
        if (position & 1) {
            col1Div.appendChild(element)
        }
        else {
            col2Div.appendChild(element)
        }
        position++
    }

    document.getElementById('all-turns-list').appendChild(col1Div)
    document.getElementById('all-turns-list').appendChild(col2Div)
}

const deleteTurn = (turn) => {
    $.ajax({
        url: turnsGetAll,
        headers: { 'Authorization': `Bearer ${userData.access_token}`, 'Content-Type': 'application/json' },
        type: 'DELETE',
        data: JSON.stringify({
            turnId: turn.id
        }),
        success: () => {
            console.log('turn deleted')
        },
        error: (error) => {
            console.log(error)
        }
    })
}

const cancelCurrentTurn = () => {
    if (currentTurn) {
        deleteTurn(currentTurn)
        currentTurn = undefined
        updateTurns()
    }
    else if (nextTurn) {
        deleteTurn(nextTurn)
        nextTurn = undefined
        updateTurns()
    }
}

const accessTurn = () => {
    const turn = currentTurn ? currentTurn : nextTurn
    if (turn) {
        window.localStorage.setItem('accessedTurn', JSON.stringify(turn))
        window.localStorage.setItem('accessedLab', JSON.stringify(laboratories[turn.laboratoryId]))
        window.location.assign(labRedirectUrl)
    }
}

const createTurn = () => {
    window.location.assign(createTurnUrl)
}

if (userData) {
    $.ajax({
        url: turnsGetAll,
        headers: { 'Authorization': `Bearer ${userData.access_token}` },
        type: 'GET',
        success: (response) => {
            turns = response.reservedTurns

            $.ajax({
                url: laboratoriesGetUrl,
                headers: { 'Authorization': `Bearer ${userData.access_token}` },
                type: 'GET',
                success: (response) => {
                    console.log(response.data)
                    for (const lab of response) {
                        laboratories[lab.id] = lab
                    }

                    const now = new Date()
                    now.setHours(0)
                    now.setMinutes(0)
                    now.setSeconds(0)
                    now.setMilliseconds(0)

                    turns.forEach(turn => {
                        const turnDate = new Date(turn.date)

                        if (turnDate > now) {
                            futureTurns.push(turn)
                        }
                        else if (turnDate < now) {
                            pastTurns.push(turn)
                        }
                        else {
                            const nowTime = new Date()

                            const turnDuration = laboratories[turn.laboratoryId].turnDurationMinutes
                            const turnDurationMs = turnDuration*60*1000

                            const dateString = `${turnDate.getFullYear()}/${turnDate.getMonth()+1}/${turnDate.getDate()}`
                            const turnTime = new Date(dateString + ' ' + getTurnTime(turnDuration, turn.turn))

                            if (turnTime < nowTime) {
                                if ((turnTime.getTime() + turnDurationMs) > nowTime.getTime()) {
                                    currentTurn = turn
                                }
                                else {
                                    pastTurns.push(turn)
                                }
                            }
                            else if (turnTime > nowTime) {
                                if (turnTime.getTime() < (nowTime.getTime() + turnDurationMs)) {
                                    nextTurn = turn
                                }
                                else {
                                    futureTurns.push(turn)
                                }
                            }
                        }
                    })

                    // console.log('past:', pastTurns)
                    // console.log('curr:', currentTurn)
                    // console.log('next:', nextTurn)
                    // console.log('future:', futureTurns)

                    updateTurns()
                },
                error: (response) => {
                    console.log(response)
                }
            })
        },
        error: (response) => {
            if (response.responseText.includes('not found')) {
                localStorage.setItem('error', 'El servidor cerró la sesión')
            }
            else if (response.data.includes('expired')) {
                localStorage.setItem('error', 'La sesión a expirado')
            }
            else {
                localStorage.setItem('notify', 'Inicia sesión para brindar autorización')
            }
            logout()
        }
    })
}