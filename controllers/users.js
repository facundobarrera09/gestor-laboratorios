const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../utils/config')

const usersRouter = require('express').Router()

const orm = require('../utils/model')
const User = orm.model('User')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }

    return null
}

const stripTimestamps = (user) => {
    return user = {
        id: user.id,
        username: user.username,
        passwordHash: user.passwordHash
    }
}

usersRouter.post('/', async (request, response) => {
    let { username, password, role } = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findOne({ where: { id: decodedToken.id } })
    if (!user || user.role !== 'administrator') {
        throw new Error('unauthorized')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUserData = {
        username,
        passwordHash,
        role
    }

    let savedUser = await User.create(newUserData)
    savedUser = stripTimestamps(savedUser)

    response.status(201).json(savedUser)
})

module.exports = usersRouter