const config = require('./utils/config')
const { Sequelize } = require('sequelize')
const express = require('express')
require('express-async-errors')
const app = express()

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)


// connect to database
const sequelize = new Sequelize(config.DATABASE, config.DB_USER, config.DB_PASSWORD, {
    host: config.MYSQL_HOST,
    dialect: 'mysql'
})

sequelize.authenticate()
    .then(() => {
        logger.info('Connection stablished')
    })
    .catch((error) => {
        logger.error('Unable to connect:', error)
    })


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app