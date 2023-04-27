const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../utils/config')

const accessRouter = require('express').Router()

const orm = require('../utils/model')
const { on } = require('nodemon')
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

const getCurrentTurn = (turnDuration) => {
    const now = new Date()
    const dateStart = new Date(now)
    dateStart.setHours(0)
    dateStart.setMinutes(0)
    dateStart.setSeconds(0)
    dateStart.setMilliseconds(0)
    
    const time = now.getTime() - dateStart.getTime()

    return (Math.floor(time/(1000*60*turnDuration)))
}

accessRouter.post('/', async (request, response) => {
    let { userId, labId } = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findOne({ where: { id: decodedToken.id } })
    if (!user || user.role !== 'laboratory') {
        throw new Error('unauthorized')
    }

    const lab = await Laboratory.findOne({ where: { id: labId } })

    const now = new Date()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    now.setMilliseconds(0)
    const turn = getCurrentTurn(lab.turnDurationMinutes)

    const accessingUser = await User.findOne({ where: { id: userId } })
    const posibleTurn = await Turn.findOne({ where: { date: now, turn, accessingUserId: accessingUser.id } })

    response.status(200).json({
        hasAccess: (posibleTurn) ? true : false
    })
})

module.exports = accessRouter