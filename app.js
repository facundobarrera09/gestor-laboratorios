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
    dialect: 'mysql',
    logging: false
})


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app