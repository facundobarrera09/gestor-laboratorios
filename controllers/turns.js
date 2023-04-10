const turnsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const orm = require('../utils/model')
const User = orm.model('User')
const Turn = orm.model('Turn')
const Laboratory = orm.model('Laboratory')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }

    return null
}

const checkTurnValidity = async (laboratoryId, turn) => {
    const lab = await Laboratory.findOne({ where: { id: laboratoryId } })
    const turnDurationMinutes = lab.turnDurationMinutes

    const allTurns = (24*60) / turnDurationMinutes

    return (turn <= allTurns && turn > 0)
}

const checkTurnAvailability = async (laboratoryId, date, turn) => {
    const reservedTurn = await Turn.findOne({ where: { date, turn, laboratoryId } })
    return (reservedTurn) ? false : true
}

turnsRouter.post('/', async (request, response, next) => {
    let { date, turn, accessingUserId, laboratoryId } = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findOne({ where: { id: decodedToken.id } })
    if (!user) {
        throw new Error('unauthorized')
    }

    const creatingUserId = user.id

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
            response.status(400).json({ error: 'begin date; end date; accessing user; or laboratory id missing' })
            return
        }
    }

    const isTurnValid = await checkTurnValidity(laboratoryId, turn)
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

module.exports = turnsRouter
