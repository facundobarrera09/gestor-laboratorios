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
        test('succeed with valid data', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                accessingUserId: 1,
                creatingUserId: 1
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
                accessingUserId: 1,
                creatingUserId: 4
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
    })
})