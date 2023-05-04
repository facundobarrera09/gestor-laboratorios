const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()

const orm = require('../utils/model')
const User = orm.model('User')

const stripTimestamps = (user) => {
    return user = {
        id: user.id,
        username: user.username,
        passwordHash: user.passwordHash
    }
}

usersRouter.post('/', async (request, response) => {
    let { username, password, role } = request.body

    const user = await User.findOne({ where: { id: request.oauth2.accessToken.userId } })
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