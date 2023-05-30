const turnsRouter = require('express').Router()
const config = require('../utils/config')

const orm = require('../utils/model')
const User = orm.model('User')
const Turn = orm.model('Turn')
const Laboratory = orm.model('Laboratory')

const getTimeTurn = (turnDuration, hour) => {
    return Math.floor((hour.getTime()/(1000*60)) / turnDuration)
}

const checkTurnValidity = async (laboratoryId, date, number) => {
    const lab = await Laboratory.findOne({ where: { id: laboratoryId } })
    console.log(lab)
    if (lab) {
        const turnDuration = lab.turnDurationMinutes

        const today = new Date()
        today.setHours(0,0,0,0)

        const now = new Date()
        const hour = new Date(now.getTime() - today.getTime())
        const currentTurn = getTimeTurn(turnDuration, hour)

        const allTurns = (24*60) / turnDuration

        return (number < allTurns && number >= (today.getTime() === date.getTime() ? currentTurn : 0))
    }
    else
        return false
}

const checkTurnAvailability = async (laboratoryId, date, turn) => {
    const reservedTurn = await Turn.findOne({ where: { date, turn, laboratoryId } })
    return (reservedTurn) ? false : true
}

const getAvailableTurns = (date, reserverdTurns, turnDuration) => {
    const maxAvailableTurns = (24*60)/turnDuration

    const today = new Date()
    today.setHours(0,0,0,0)

    const now = new Date()
    const hour = new Date(now.getTime() - today.getTime())
    const currentTurn = getTimeTurn(turnDuration, hour)

    let availableTurns = []

    if (date >= today) {
        for (let x = (today.getTime() === date.getTime()) ? currentTurn : 0; x < maxAvailableTurns; x++) {
            if (!reserverdTurns.find(turn => turn === x)) {
                availableTurns.push(x)
            }
        }
    }

    return availableTurns
}

turnsRouter.post('/', async (request, response, next) => {
    let { date, turn, accessingUserId, laboratoryId } = request.body

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
    if (!user) {
        throw new Error('unauthorized')
    }

    const creatingUserId = user.id

    if (!accessingUserId) {
        accessingUserId = user.id
    }

    if (user.role !== 'administrator' && creatingUserId !== accessingUserId) {
        throw new Error('unauthorized')
    }

    date = new Date(date)
    date.setHours(0, 0, 0, 0)

    const newTurnData = {
        date,
        turn,
        accessingUserId,
        creatingUserId,
        laboratoryId
    }

    for (const attribute in newTurnData) {
        if (newTurnData[attribute] === undefined) {
            response.status(400).json({ error: 'date; turn; or laboratory id missing' })
            return
        }
    }

    const isTurnValid = await checkTurnValidity(laboratoryId, date, turn)
    if (!(isTurnValid)) {
        response.status(400).json({ error : 'turn does not exist' })
        return
    }

    const isTurnAvailable = await checkTurnAvailability(laboratoryId, date, turn)
    if (!(isTurnAvailable)) {
        response.status(400).json({ error: 'turn already reserved' })
        return
    }

    try {
        await Turn.create(newTurnData)
        response.status(201).end()
    }
    catch (error) {
        if (error.name === 'SequelizeDatabaseError' && error.message.includes('foreign key')) {
            response.status(400).json({ error: 'non existent accessing user' })
        }
        else if (error.name === 'SequelizeValidationError') {
            if(error.message.includes('notNull Violation')) {
                response.status(400).json({ error: 'begin date; end date; accessing user; or laboratory id missing' })
            }
            else if (error.message.includes(`begin date and end date do not represent stablished turn duration (${config.TURN_DURATION})`)) {
                response.status(400).json({ error: `begin date and end date do not represent stablished turn duration (${config.TURN_DURATION})` })
            }
            else if (error.message.includes('begin date cannot be greater than end date')) {
                response.status(400).json({ error: 'begin date cannot be greater than end date' })
            }
        }
        else {
            next(error)
        }
    }
})

turnsRouter.get('/', async (request, response) => {
    let date = request.query.date
    try {
        date = new Date(`${date.replaceAll('-','/')} 00:00:00`)
    }
    catch {
        date = null
    }

    let reservedTurns

    let where = {
        deletedAt: null
    }
    if (date)
        where.date = date

    if (request.session.accessToken) {
        const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
        if (!user) {
            throw new Error('unauthorized')
        }

        where.accessingUserId = user.id
        reservedTurns = await Turn.findAll({ attributes: ['id', 'date', 'turn', 'accessingUserId', 'creatingUserId', 'laboratoryId'], where })
    }
    else {
        const lab = await Laboratory.findOne({ where: { clientId: request.oauth2.accessToken.clientId } })
        where.laboratoryId = lab.id
        reservedTurns = await Turn.findAll({ attributes: ['id', 'date', 'turn', 'accessingUserId', 'creatingUserId', 'laboratoryId'], where })
    }

    response.status(200).json({ reservedTurns })
})

turnsRouter.get('/available/:labId', async (request, response) => {
    const labId = request.params.labId
    const date = request.query.date ? new Date(request.query.date.replace('-', '/')) : new Date()
    date.setHours(0,0,0,0)

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
    if (!user) {
        throw new Error('unauthorized')
    }

    const lab = await Laboratory.findOne({ where: { id: labId } })
    if (!lab) {
        return response.status(400).json({ error: 'laboratory does not exist' })
    }

    const reservedTurns = await Turn.findAll({ where: { date, laboratoryId: labId, deletedAt: null } })
    const reservedTurnsNumbers = reservedTurns.map(turn => turn.turn)

    response.status(200).json({ laboratoryId: labId, date, availableTurns: getAvailableTurns(date, reservedTurnsNumbers, lab.turnDurationMinutes) })
})

turnsRouter.get('/detailed/:labId', async (request, response) => {
    const labId = request.params.labId
    const date = request.query.date ? new Date(request.query.date.replace('-', '/')) : new Date()
    date.setHours(0,0,0,0)

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
    if (!user) {
        throw new Error('unauthorized')
    }

    const lab = await Laboratory.findOne({ where: { id: labId } })
    if (!lab) {
        return response.status(400).json({ error: 'laboratory does not exist' })
    }

    let reservedTurns = await Turn.findAll({ where: { date, laboratoryId: labId, deletedAt: null } })
    if (user.role === 'default') {
        reservedTurns = reservedTurns.filter(turn => turn.accessingUserId === user.id)
    }

    response.status(200).json({ reservedTurns })
})

turnsRouter.delete('/', async (request, response) => {
    const { turnId } = request.body

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
    if (!user) {
        throw new Error('unauthorized')
    }

    const turn = await Turn.findOne({ where: { id: turnId } })
    if (!turn) {
        return response.status(400).json({ error: 'turn does not exist' })
    }
    if (turn.creatingUserId !== user.id) {
        return response.status(403).json({ error: 'not authorized to delete turn' })
    }

    await turn.destroy()
    response.status(200).end()
})

module.exports = turnsRouter
