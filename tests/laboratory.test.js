const bcrypt = require('bcrypt')

let app, supertest, api, orm, helper, User, Laboratory

beforeAll(async () => {
    app = await require('../app')
    supertest = require('supertest')
    api = supertest(app)

    orm = require('../utils/model')
    User = orm.model('User')
    Laboratory = orm.model('Laboratory')

    helper = require('./helper')

    await helper.truncateTables(['User'])
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
})

describe('when there is initially no laboratories in the database', () => {
    beforeEach(async () => {
        await helper.truncateTables(['Laboratory'])
    })

    describe('creation of laboratory', () => {
        test('succeeds with valid data', async () => {
            await orm.getSequelize().authenticate()
            const labsAtStart = await helper.laboratoriesInDb()

            const newLabData = {
                name: 'Science lab',
                turnDurationMinutes: 10,
                ip: '192.168.100.20',
                port: '3000',
                state: 'active'
            }

            const user = await helper.loginAs(api, 'facundo', 'password')

            await api
                .post('/api/laboratories')
                .send(newLabData)
                .set('authorization', `Bearer ${user.token}`)
                .expect(201)

            const labsAtEnd = await helper.laboratoriesInDb()
            const names = labsAtEnd.map(lab => lab.name)

            expect(names).toContain(newLabData.name)
            expect(labsAtEnd).toHaveLength(labsAtStart.length +1)
        })

        test('fails if turn duration is not valid', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const newLabData = {
                name: 'Science lab',
                turnDurationMinutes: 13,
                ip: '192.168.100.20',
                port: '3000',
                state: 'active'
            }

            const user = await helper.loginAs(api, 'facundo', 'password')

            const response = await api
                .post('/api/laboratories')
                .send(newLabData)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toContain('does not divide the day into equal turns')
        })

        test('fails if ip is not valid', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const newLabData = {
                name: 'Science lab',
                turnDurationMinutes: 10,
                ip: 'not.a.real.ip',
                port: '3000',
                state: 'active'
            }

            const user = await helper.loginAs(api, 'facundo', 'password')

            const response = await api
                .post('/api/laboratories')
                .send(newLabData)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toEqual('ip is not valid')
        })

        test('fails if port is not valid', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const newLabData = {
                name: 'Science lab',
                turnDurationMinutes: 10,
                ip: '192.168.100.20',
                port: '1000000',
                state: 'active'
            }

            const user = await helper.loginAs(api, 'facundo', 'password')

            const response = await api
                .post('/api/laboratories')
                .send(newLabData)
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toEqual('port is not valid')
        })

        test('fails if user does not have authorization', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const newLabData = {
                name: 'Science lab',
                turnDurationMinutes: 10,
                ip: '192.168.100.20',
                port: '1000',
                state: 'active'
            }

            const user = await helper.loginAs(api, 'james', 'password')

            const response = await api
                .post('/api/laboratories')
                .send(newLabData)
                .set('authorization', `Bearer ${user.token}`)
                .expect(401)

            const labsAtEnd = await helper.laboratoriesInDb()

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(response.text).toContain('not authorized to perform that action')
        })

        test('fails if missing credentials', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const newLabData = {
                name: 'Science lab',
                turnDurationMinutes: 10,
                ip: '192.168.100.20',
                port: '1000',
                state: 'active'
            }

            const response = await api
                .post('/api/laboratories')
                .send(newLabData)
                .expect(403)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error_description

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toContain('Bearer token not found')
        })

        test('fails if there is missing data', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const user = await helper.loginAs(api, 'facundo', 'password')

            const response = await api
                .post('/api/laboratories')
                .send({})
                .set('authorization', `Bearer ${user.token}`)
                .expect(400)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toEqual('name; duration of turn; ip; or status missing')
        })
    })
})


describe('when there are some laboratories in the database', () => {
    beforeAll(async () => {
        await helper.truncateTables(['Laboratory'])

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
        await Laboratory.create({
            name: 'Laboratory of chemestry',
            turnDurationMinutes: 10,
            ip: '192.168.100.22',
            port: '3000',
            state: 'inactive'
        })
        await Laboratory.create({
            name: 'Laboratory of thermodynamics',
            turnDurationMinutes: 10,
            ip: '192.168.100.23',
            port: '3000',
            state: 'approval_pending'
        })
    })

    describe('viewing of laboratories', () => {
        test('all users can see active and inactive laboratories', async () => {
            const user = await helper.loginAs(api, 'james', 'password')

            const labsInDb = await helper.laboratoriesInDb()
            const activeAndInactiveLabs = labsInDb.filter(lab => (lab.state === 'active' || lab.state === 'inactive'))
            const activeAndInactiveLabsNames = activeAndInactiveLabs.map(lab => lab.name)

            const response = await api
                .get('/api/laboratories/active-inactive')
                .set('authorization', `Bearer ${user.token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const labs = response.body
            const labsNames = labs.map(lab => lab.name)

            expect(labsNames).toEqual(activeAndInactiveLabsNames)
        })

        test('administrators can see approval pending laboratories', async () => {
            const user = await helper.loginAs(api, 'facundo', 'password')

            const labsInDb = await helper.laboratoriesInDb()
            const approvalPendingLabs = labsInDb.filter(lab => lab.state === 'approval_pending')
            const approvalPendingLabsNames = approvalPendingLabs.map(lab => lab.name)

            const response = await api
                .get('/api/laboratories/approval_pending')
                .set('authorization', `Bearer ${user.token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const labs = response.body
            const labsNames = labs.map(lab => lab.name)

            expect(labsNames).toEqual(approvalPendingLabsNames)
        })

        test('default users can not see approval pending laboratories', async () => {
            const user = await helper.loginAs(api, 'james', 'password')

            const response = await api
                .get('/api/laboratories/approval_pending')
                .set('authorization', `Bearer ${user.token}`)
                .expect(401)

            const error = response.body.error

            expect(error).toEqual('not authorized to perform that action')
        })
    })
})