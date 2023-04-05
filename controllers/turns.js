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
        else {
            next(error)
        }
    }
})

module.exports = turnsRouter
