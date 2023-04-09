const labRouter = require('express').Router()

const orm = require('../utils/model')
const Laboratory = orm.model('Laboratory')

labRouter.post('/', async (request, response, next) => {
    const { name, turnDurationMinutes, ip, port, status } = request.body

    const newLabData = {
        name,
        turnDurationMinutes,
        ip,
        port,
        status
    }

    try {
        await Laboratory.create(newLabData)
        response.status(201).end()
    }
    catch (error) {
        // console.log(error.name, ':', error.message)
        if (error.name === 'SequelizeValidationError') {
            if (error.message.includes('notNull Violation')) {
                response.status(400).json({ error: 'name; duration of turn; ip; or status missing' })
            }
            else if (error.message.includes('Validation error')) {
                if (error.message.includes('isIP')) {
                    response.status(400).json({ error: 'ip is not valid' })
                }
                else if (error.message.includes('len on port')) {
                    response.status(400).json({ error: 'port is not valid' })
                }
                else if (error.message.includes('divide the day into equal turns')) {
                    response.status(400).json({ error: error.message.replace('Validation error: ', '') })
                }
            }
        }
        else {
            next(error)
        }
    }

})

module.exports = labRouter