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
        const loginRouter = require('./controllers/login')
        const usersRouter = require('./controllers/users')
        const turnsRouter = require('./controllers/turns')

        app = express()

        const logger = require('./utils/logger')
        const middleware = require('./utils/middleware')

        if (config.NODE_ENV === 'development') {
            logger.info('Resetting database')
            await sequelize.sync({ force: true })
        }

        app.use(express.static('build'))
        app.use(express.json())
        app.use(middleware.requestLogger)

        app.use('/login', loginRouter)
        app.use('/users', usersRouter)
        app.use('/turns', turnsRouter)

        app.use(middleware.unknownEndpoint)
        app.use(middleware.errorHandler)

        return app
    })
