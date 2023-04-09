let app, supertest, api, orm, helper

beforeAll(async () => {
    app = await require('../app')
    supertest = require('supertest')
    api = supertest(app)

    orm = require('../utils/model')

    helper = require('./helper')
    await helper.syncDatabase()
})

describe('when there is initially no laboratories in the database', () => {
    beforeAll(async () => {
        await helper.syncDatabase()
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

            await api
                .post('/laboratories')
                .send(newLabData)
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

            const response = await api
                .post('/laboratories')
                .send(newLabData)
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

            const response = await api
                .post('/laboratories')
                .send(newLabData)
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

            const response = await api
                .post('/laboratories')
                .send(newLabData)
                .expect(400)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toEqual('port is not valid')
        })

        test('fails if there is missing data', async () => {
            const labsAtStart = await helper.laboratoriesInDb()

            const response = await api
                .post('/laboratories')
                .send({})
                .expect(400)

            const labsAtEnd = await helper.laboratoriesInDb()
            const error = response.body.error

            expect(labsAtEnd).toEqual(labsAtStart)
            expect(error).toEqual('name; duration of turn; ip; or status missing')
        })
    })
})