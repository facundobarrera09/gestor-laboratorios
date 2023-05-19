const laboratorio = JSON.parse(localStorage.getItem('accessedLab'))
const turno = JSON.parse(localStorage.getItem('accessedTurn'))

if (!laboratorio || !turno) {
    window.location.assign('/misTurnos.html')
}

localStorage.removeItem('accessedLab')
localStorage.removeItem('accessedTurn')

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

turno.date = new Date(turno.date)
const fechaString = `${turno.date.getFullYear()}/${turno.date.getMonth()+1}/${turno.date.getDate()}`
const fechaTurno = new Date(`${fechaString} ${getTurnTime(laboratorio.turnDurationMinutes, turno.turn)}`)

var contador = setInterval(async () => {
    const ahora = new Date()
    const distancia = fechaTurno.getTime() - ahora.getTime()

    console.log(fechaTurno, ahora)
    console.log(fechaTurno.getTime(), ahora.getTime())
    console.log(distancia)
    if (distancia > 0) {
        document.getElementById('reloj').innerText = new Date(distancia).toTimeString().slice(3,8)
    }
    else {
        clearInterval(contador)

        document.getElementById('title').innerText = 'Redireccionando...'
        document.getElementById('reloj').innerText = '00:00'

        await new Promise(r => setTimeout(r, 1000))
        window.location.replace(`http://${laboratorio.ip}:${laboratorio.port}`)
    }
}, 1000)