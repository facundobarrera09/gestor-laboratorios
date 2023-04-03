const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

let app

// setup database
require('./utils/model').setup('./models', config.DATABASE, config.DB_USER, config.DB_PASSWORD, {
    host: config.MYSQL_HOST,
    dialect: 'mysql',
    logging: false
})

const orm = require('./utils/model')
const sequelize = orm.getSequelize()

module.exports = sequelize.authenticate()
    .then(async () => {
        await sequelize.sync({ force: true })

        const usersRouter = require('./controllers/users')

        app = express()

        const logger = require('./utils/logger')
        const middleware = require('./utils/middleware')

        app.use(express.static('build'))
        app.use(express.json())
        app.use(middleware.requestLogger)


        app.use('/users', usersRouter)

        app.use(middleware.unknownEndpoint)
        app.use(middleware.errorHandler)

        return app
    })
