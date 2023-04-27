const config = require('./utils/config')
const express = require('express')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
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

const User = orm.model('User')
const Turn = orm.model('Turn')
const Laboratory = orm.model('Laboratory')

module.exports = sequelize.authenticate()
    .then(async () => {
        const loginRouter = require('./controllers/login')
        const accessRouter = require('./controllers/access')
        const usersRouter = require('./controllers/users')
        const turnsRouter = require('./controllers/turns')
        const labRouter = require('./controllers/laboratories')

        app = express()

        const logger = require('./utils/logger')
        const middleware = require('./utils/middleware')

        if (config.NODE_ENV === 'development' && process.env.RESET_DEV_DATABASE === 'true') {
            logger.info('Resetting database')
            await sequelize.sync({ force: true })

            await User.create({
                username: 'facundo',
                passwordHash: await bcrypt.hash('password', 10),
                role: 'administrator'
            })
            await User.create({
                username: 'laboratory1',
                passwordHash: await bcrypt.hash('password', 10),
                role: 'laboratory'
            })
            await User.create({
                username: 'james',
                passwordHash: await bcrypt.hash('password', 10),
                role: 'default'
            })
            await User.create({
                username: 'austin',
                passwordHash: await bcrypt.hash('password', 10),
                role: 'default'
            })

            await Laboratory.create({
                name: 'Laboratory of geosphere',
                turnDurationMinutes: 10,
                ip: '127.0.0.1',
                port: '3000',
                state: 'active'
            })
            await Laboratory.create({
                name: 'Laboratory of physics',
                turnDurationMinutes: 10,
                ip: '192.168.100.21',
                port: '3000',
                state: 'active'
            })

            await Turn.create({
                date: new Date('2023/04/08 00:00'),
                turn: 1,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            })
            await Turn.create({
                date: new Date('2023/04/08 00:00'),
                turn: 2,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            })
            await Turn.create({
                date: new Date(),
                turn: 90,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            })
            await Turn.create({
                date: new Date(),
                turn: 91,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            })
            await Turn.create({
                date: new Date(),
                turn: 80,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            })
            await Turn.create({
                date: new Date('2024/04/08 00:00'),
                turn: 1,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            })
            await Turn.create({
                date: new Date('2023/04/08 00:00'),
                turn: 1,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 2
            })
            await Turn.create({
                date: new Date('2023/04/08 00:00'),
                turn: 2,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 2
            })
            await Turn.create({
                date: new Date('2023/04/08 00:00'),
                turn: 3,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 2
            })
        }

        app.use(express.static('public'))
        app.use(express.json())
        app.use(cookieParser())
        app.use(middleware.requestLogger)

        app.use('/api/login', loginRouter)
        app.use('/api/access', accessRouter)
        app.use('/api/users', usersRouter)
        app.use('/api/turns', turnsRouter)
        app.use('/api/laboratories', labRouter)

        app.use(middleware.unknownEndpoint)
        app.use(middleware.errorHandler)

        return app
    })
