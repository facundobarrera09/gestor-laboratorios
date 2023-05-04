const config = require('./utils/config')
const express = require('express')
const session = require('express-session')
require('express-async-errors')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')

let app, oauth2

// setup database
require('./utils/model').setup('./models', config.DATABASE, config.DB_USER, config.DB_PASSWORD, {
    host: config.MYSQL_HOST,
    dialect: 'mysql',
    logging: false
})

const orm = require('./utils/model')
const sequelize = orm.getSequelize()

const Client = orm.model('Client')
const User = orm.model('User')
const Turn = orm.model('Turn')
const Laboratory = orm.model('Laboratory')

module.exports = sequelize.authenticate()
    .then(async () => {
        if (config.NODE_ENV === 'development' && process.env.RESET_DEV_DATABASE === 'true') {
            logger.info('Resetting database')
            await sequelize.sync({ force: true })

            await User.create({
                username: 'facundo',
                passwordHash: await bcrypt.hash('password', 10),
                role: 'administrator'
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
            await User.create({
                username: 'laboratory1',
                passwordHash: await bcrypt.hash('password', 10),
                role: 'developer'
            })

            await Client.create({
                id: config.CLIENT_ID,
                name: 'Gestor de Laboratorios',
                secret: config.CLIENT_SECRET,
                redirectUri: 'http://localhost:3001/misTurnos.html',
                grants: 'password',
                scope: 'read write'
            })
            await Client.create({
                id: 'laboratorio.remoto',
                name: 'Laboratorio remoto',
                secret: 'secreto',
                redirectUri: 'http://127.0.0.1:3000',
                grants: 'authorization_code',
                scope: 'read'
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

        const loginRouter = require('./controllers/login')
        const logoutRouter = require('./controllers/logout')
        const usersRouter = require('./controllers/users')
        const turnsRouter = require('./controllers/turns')
        const labRouter = require('./controllers/laboratories')

        const logger = require('./utils/logger')
        const middleware = require('./utils/middleware')
        const isAuthorized = require('./utils/isAuthorized')

        app = express()
        oauth2 = require('./oauth/oauth20')()

        oauth2.events.on('token_granted', (req, token) => {
            if (req.originalUrl.includes('login')) {
                logger.info('User logged in')
            }
            req.session.accessToken = token
        })
        oauth2.events.on('OAuth2Forbidden', (req, err) => {
            if (err.code === 'forbidden') {
                req.session.accessToken = undefined
            }
        })

        // Middleware
        app.use(session({ secret: config.SESSION_SECRET, resave: false, saveUninitialized: false }))
        app.use(express.static('public'))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser())
        app.use(middleware.requestLogger)
        app.use(oauth2.inject())

        // Routers
        app.use('/api/login', loginRouter)
        app.use('/api/logout', oauth2.middleware.bearer, logoutRouter)
        app.use('/api/users', oauth2.middleware.bearer, usersRouter)
        app.use('/api/turns', oauth2.middleware.bearer, turnsRouter)
        app.use('/api/laboratories', oauth2.middleware.bearer, labRouter)

        // Oauth Provider
        app.get('/authorization', isAuthorized, oauth2.controller.authorization)
        app.post('/authorization', isAuthorized, oauth2.controller.authorization)
        app.post('/token', oauth2.controller.token)

        // Middleware
        app.use(middleware.unknownEndpoint)
        app.use(middleware.errorHandler)

        return app
    })
