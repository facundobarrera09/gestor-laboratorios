const bcrypt = require('bcrypt')

let app, supertest, api, orm, helper, User

beforeAll(async () => {
    app = await require('../app')
    supertest = require('supertest')
    api = supertest(app)

    orm = require('../utils/model')
    User = orm.model('User')

    helper = require('./helper')
})

describe('login when there is initially two users in the database', () => {
    beforeAll(async () => {
        await helper.truncateTables(['User'])

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
    })

    test('succeeds with correct data', async () => {
        const user = {
            grant_type: 'password',
            scope: 'read write',
            username: 'james',
            password: 'password'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.data).not.toBe(null)
    })

    test('fails with incorrect password', async () => {
        const user = {
            grant_type: 'password',
            scope: 'read write',
            username: 'james',
            password: 'incorrectpassword'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(401)

        const error = response.body.error_description
        expect(error).toEqual('Wrong user password provided')
    })

    test('fails with missing data', async () => {
        const response = await api
            .post('/api/login')
            .send({
                grant_type: 'password',
                scope: 'read write'
            })
            .expect(400)

        const error = response.body.error_description
        expect(error).toEqual('Username is mandatory for password grant type')
    })

    test('fails with grant_type missing', async () => {
        const user = {
            scope: 'read write',
            username: 'james',
            password: 'password'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(400)

        const error = response.body.error_description
        expect(error).toEqual('Body does not contain grant_type parameter')
    })

    test('fails with wrong grant_type', async () => {
        const user = {
            grant_type: 'authorization_code',
            scope: 'read write',
            username: 'james',
            password: 'password'
        }

        const response = await api
            .post('/api/login')
            .send(user)
            .expect(400)

        const error = response.body.error_description
        expect(error).toEqual('Grant type is not available for the client')
    })
})