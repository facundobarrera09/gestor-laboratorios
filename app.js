const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

// setup database
require('./utils/model').setup('./models', config.DATABASE, config.DB_USER, config.DB_PASSWORD, {
    host: config.MYSQL_HOST,
    dialect: 'mysql'
})

const orm = require('./utils/model')
const User = orm.model('User')

const main = async () => {
    await orm.getSequelize()
        .sync({ force: true })

    const jane = await User.create({ username: 'jane', password: 'password' })
    const austin = await User.create({ username: 'austin', password: 'password' })

    jane.username = 'jane123'
    await jane.save()

    austin.set({
        username: 'aus321',
        password: 'constrasena'
    })
    await austin.save()
}

main()

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app