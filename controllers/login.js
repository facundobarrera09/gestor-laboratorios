const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const bcrypt = require('bcrypt')

const loginRouter = require('express').Router()

const orm = require('../utils/model')
const User = orm.model('User')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    if (!(username && password)) {
        response.status(400).json({
            error: 'missing credentials'
        })
    }

    const user = await User.findOne({
        where: {
            username
        }
    })

    const isPasswordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && isPasswordCorrect)) {
        response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        id: user.id,
        username: user.username,
        role: user.role
    }

    const token = jwt.sign(
        userForToken,
        config.SECRET,
        { expiresIn: 60*60 }
    )

    response.status(200).send({
        token,
        username: user.username,
        role: user.role
    })
})

module.exports = loginRouter