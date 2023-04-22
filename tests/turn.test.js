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
    await Laboratory.create({
        name: 'Laboratory of physics',
        turnDurationMinutes: 10,
        ip: '192.168.100.21',
        port: '3000',
        state: 'active'
    })
})

describe('when there are no turns in the database', () => {
    beforeEach(async () => {
        await helper.truncateTables(['Turn'])
    })

    describe('creation of a turn', () => {
        test('succeeds with valid data and user creates turn for themselves', async () => {
            const turnsAtStart = await helper.turnsInDb()

            const user = await helper.loginAs('james')

            const turn = {
                date: '2023/07/08 13:15',
                turn: 1,
                laboratoryId: 1
            }

            await api
                .post('/api/turns')
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
                .post('/api/turns')
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
                .post('/api/turns')
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
                .post('/api/turns')
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
                .post('/api/turns')
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
                .post('/api/turns')
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
                .post('/api/turns')
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

describe('when there are some turns in the database', () => {
    describe('creation of a turn', () => {
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
                .post('/api/turns')
                .send(turn)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const turnsAtEnd = await helper.turnsInDb()
            const error = response.body.error

            expect(turnsAtEnd).toEqual(turnsAtStart)
            expect(error).toEqual('turn already reserved')
        })
    })

    describe('viewing of turns', () => {
        beforeAll(async () => {
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

            await Turn.create({
                date: new Date(),
                turn: 1,
                accessingUserId: 2,
                creatingUserId: 1,
                laboratoryId: 2
            })
            await Turn.create({
                date: new Date(),
                turn: 2,
                accessingUserId: 2,
                creatingUserId: 2,
                laboratoryId: 2
            })
            await Turn.create({
                date: new Date(),
                turn: 3,
                accessingUserId: 1,
                creatingUserId: 1,
                laboratoryId: 2
            })
        })

        test('all users can check for available turns for a lab', async () => {
            const user = await helper.loginAs('james')
            const labId = 1

            const allTurnsInDb = await helper.turnsInDb()
            const turnsInDbForLab = allTurnsInDb.map(turn => turn.laboratoryId === labId)
            const turnsInDb = turnsInDbForLab.map(turn => turn.turn)

            const now = new Date()
            const date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`

            const response = await api
                .get(`/api/turns/available/${labId}?date=${date}`)
                .set('authorization', `Bearer ${user.token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const availableTurnsData = response.body.availableTurns
            const availableTurns = availableTurnsData.map(turn => turn.turn)

            expect(availableTurns).not.toContain(turnsInDb)
        })

        test('administrators can check detailed information about all turns for a lab', async () => {
            const user = await helper.loginAs('facundo')
            const labId = 1

            const allTurnsInDb = await helper.turnsInDb(true)
            const turnsInDbForLab = allTurnsInDb.filter(turn => turn.laboratoryId === labId)
            const turnsInDb = turnsInDbForLab.map(turn => {
                return { turn: turn.id, accessingUserId: turn.accessingUserId }
            })

            const now = new Date()
            const date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`

            const response = await api
                .get(`/api/turns/detailed/${labId}?date=${date}`)
                .set('authorization', `Bearer ${user.token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            let reservedTurns = response.body.reservedTurns
            reservedTurns = reservedTurns.map(turn => {
                return { turn: turn.id, accessingUserId: turn.accessingUserId }
            })

            expect(reservedTurns).toEqual(turnsInDb)
        })

        test('default users can get detailed information about their turns', async () => {
            const user = await helper.loginAs('james')
            const labId = 2

            const allTurnsInDb = await helper.turnsInDb(true)
            const turnsInDbForLab = allTurnsInDb.filter(turn =>
                turn.laboratoryId === labId && turn.accessingUserId === user.id
            )
            const turnsInDb = turnsInDbForLab.map(turn => {
                return { turn: turn.id, accessingUserId: turn.accessingUserId }
            })

            const now = new Date()
            const date = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`

            const response = await api
                .get(`/api/turns/detailed/${labId}?date=${date}`)
                .set('authorization', `Bearer ${user.token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            let reservedTurns = response.body.reservedTurns
            reservedTurns = reservedTurns.map(turn => {
                return { turn: turn.id, accessingUserId: turn.accessingUserId }
            })

            expect(reservedTurns).toEqual(turnsInDb)
        })
    })
})