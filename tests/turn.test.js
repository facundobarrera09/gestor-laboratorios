const config = require('../utils/config')
const bcrypt = require('bcrypt')
// const config = require('../utils/config')

let app, supertest, api, orm, helper, User, Laboratory

beforeAll(async () => {
    app = await require('../app')
    supertest = require('supertest')
    api = supertest(app)

    orm = require('../utils/model')
    User = orm.model('User')
    Laboratory = orm.model('Laboratory')

    helper = require('./helper')
    await helper.syncDatabase()

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
        ip: '192.168.100.20',
        port: '3000',
        state: 'active'
    })
})

describe('when there are no turns in the database', () => {
    describe('creation of a turn', () => {
        beforeAll(async () => {
            await orm.getSequelize().authenticate()
        })

        test('succeeds with valid data', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                beginsAt: '04/03/2023 22:30',
                endsAt: '04/03/2023 22:40',
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            }

            await api
                .post('/turns')
                .send(turn)
                .expect(201)

            const turnsAtEnd = await helper.turnsInDb()

            expect(turnsAtEnd).toHaveLength(turnsAtStart.length + 1)
        })

        test('fails if accessing or creating user does not exist', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                beginsAt: '04/03/2023 22:30',
                endsAt: '04/03/2023 22:40',
                accessingUserId: 1,
                creatingUserId: 4,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('non existent creating or accessing user')
        })

        test('fails if begin date and end date dont represent turn duration', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                beginsAt: '04/03/2023 22:30',
                endsAt: '04/03/2023 22:45',
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual(`begin date and end date do not represent stablished turn duration (${config.TURN_DURATION})`)
        })

        test('fails if begin date is before end date', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                beginsAt: '04/03/2023 22:40',
                endsAt: '04/03/2023 22:30',
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('begin date cannot be greater than end date')
        })

        test('fails if data missing', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                accessingUserId: 1,
                creatingUserId: 4,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('begin date; end date; accessing user; creating user; or laboratory id missing')
        })
    })
})