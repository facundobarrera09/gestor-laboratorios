const bcrypt = require('bcrypt')
// const config = require('../utils/config')

let app, supertest, api, orm, helper, User, Laboratory, Turn

beforeAll(async () => {
    app = await require('../app')
    supertest = require('supertest')
    api = supertest(app)

    orm = require('../utils/model')
    User = orm.model('User')
    Laboratory = orm.model('Laboratory')
    Turn = orm.model('Turn')

    helper = require('./helper')
    await helper.syncDatabase()

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

    await Laboratory.create({
        name: 'Laboratory of geosphere',
        turnDurationMinutes: 10,
        ip: '192.168.100.20',
        port: '3000',
        state: 'active'
    })
})

describe('when there are no turns in the database', () => {
    beforeEach(async () => {
        await helper.truncateTables(['Turn'])
    })

    describe('creation of a turn', () => {
        test('succeeds with valid data and user creates turn for themselfs', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('james')

            const turn = {
                date: '2023/07/08 13:15',
                turn: 1,
                accessingUserId: user.id,
                laboratoryId: 1
            }

            await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(201)

            const turnsAtEnd = await helper.turnsInDb()

            expect(turnsAtEnd).toHaveLength(turnsAtStart.length + 1)
        })

        test('succeeds when administrator creates turn for someone else', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('facundo')

            const turn = {
                date: '2023/07/08 13:15',
                turn: 1,
                accessingUserId: 2,
                laboratoryId: 1
            }

            await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(201)

            const turnsAtEnd = await helper.turnsInDb()

            expect(turnsAtEnd).toHaveLength(turnsAtStart.length + 1)
        })

        test('fails if accessing user does not exist', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('facundo')

            const turn = {
                date: '2023/04/08',
                turn: 2,
                accessingUserId: 4,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('non existent accessing user')
        })

        test('fails if turn does not exist', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('facundo')

            const turn = {
                date: '2023/04/08',
                turn: 10000,
                accessingUserId: 1,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('turn does not exist')
        })

        test('fails if user is not authorized to create turn', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('james')

            const turn = {
                date: '2023/04/08',
                turn: 1,
                accessingUserId: 1,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(401)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('not authorized to perform that action')
        })

        test('fails if missing credentials', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const turn = {
                date: '2023/07/08 13:15',
                turn: 1,
                accessingUserId: 1,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .expect(401)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('jwt must be provided')
        })

        test('fails if data missing', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('facundo')

            const turn = {
                accessingUserId: 1,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('begin date; end date; accessing user; or laboratory id missing')
        })
    })
})

describe('when there is a couple of turns in the database', () => {
    beforeEach(async () => {
        await helper.truncateTables(['Turn'])

        await Turn.create({
            date: new Date(),
            turn: 1,
            accessingUserId: 1,
            creatingUserId: 1,
            laboratoryId: 1
        })
        await Turn.create({
            date: new Date(),
            turn: 2,
            accessingUserId: 1,
            creatingUserId: 1,
            laboratoryId: 1
        })
    })

    describe('creation of a turn', () => {
        test('fails if turn is already occupied', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('facundo')

            const turn = {
                date: new Date(),
                turn: 1,
                accessingUserId: 1,
                creatingUserId: user.id,
                laboratoryId: 1
            }

            const response = await api
                .post('/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('turn already reserved')
        })
    })
})