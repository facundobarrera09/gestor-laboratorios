const config = require('../utils/config')
const turnsRouter = require('express').Router()

const orm = require('../utils/model')
const Turn = orm.model('Turn')
const Laboratory = orm.model('Laboratory')

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
    let { date, turn, creatingUserId, accessingUserId, laboratoryId } = request.body

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
            response.status(400).json({ error: 'begin date; end date; accessing user; creating user; or laboratory id missing' })
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
            response.status(400).json({ error: 'non existent creating or accessing user' })
        }
        else if (error.name === 'SequelizeValidationError') {
            if(error.message.includes('notNull Violation')) {
                response.status(400).json({ error: 'begin date; end date; accessing user; creating user; or laboratory id missing' })
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
