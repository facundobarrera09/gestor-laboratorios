const labRouter = require('express').Router()

const orm = require('../utils/model')
const User = orm.model('User')
const Laboratory = orm.model('Laboratory')

const stripLabInfo = lab => {
    return {
        id: lab.id,
        name: lab.name,
        turnDurationMinutes: lab.turnDurationMinutes,
        ip: lab.ip,
        port: lab.port,
        state: lab.state
    }
}

labRouter.post('/', async (request, response, next) => {
    const { name, turnDurationMinutes, ip, port, status } = request.body

    const newLabData = {
        name,
        turnDurationMinutes,
        ip,
        port,
        status
    }

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
    if(user.role !== 'administrator') {
        throw new Error('unauthorized')
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

labRouter.get('/:states', async (request, response) => {
    const states = request.params.states.split('-')

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })

    if (states.find(state => state === 'approval_pending')) {
        if (user.role !== 'administrator') {
            throw new Error('unauthorized')
        }
    }

    const labs = await Laboratory.findAll({
        where: {
            state: states
        }
    })

    const labsInfo = labs.map(lab => stripLabInfo(lab) )

    response.status(200).json(labsInfo)
})

module.exports = labRouter