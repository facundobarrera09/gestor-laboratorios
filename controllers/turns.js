const config = require('../utils/config')
const turnsRouter = require('express').Router()

const orm = require('../utils/model')
const Turn = orm.model('Turn')

turnsRouter.post('/', async (request, response, next) => {
    const { beginsAt, endsAt, creatingUserId, accessingUserId, laboratoryId } = request.body

    const newTurnData = {
        beginsAt,
        endsAt,
        accessingUserId,
        creatingUserId,
        laboratoryId
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
        }
        else {
            next(error)
        }
    }
})

module.exports = turnsRouter
