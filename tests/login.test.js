const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

let app, supertest, api, orm, helper, User

beforeAll(async () => {
    app = await require('../app')
    supertest = require('supertest')
    api = await supertest(app)

    orm = require('../utils/model')

    await orm.getSequelize().authenticate()

    helper = require('./helper')
    await helper.setUsersTable()

    User = orm.model('User')

    await User.create({
        username: 'james',
        passwordHash: await bcrypt.hash('password', 10)
    })
    await User.create({
        username: 'austin',
        passwordHash: await bcrypt.hash('password', 10)
    })

})

describe('login when there is initially two users in the database', () => {
    test('succeeds with correct data', async () => {
        const user = {
            username: 'james',
            password: 'password'
        }

        const response = await api
            .post('/login')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = response.body.token
        const data = jwt.verify(token, config.SECRET)

        expect(data.username).toEqual(user.username)
    })

    test('fails with incorrect password', async () => {
        const user = {
            username: 'james',
            password: 'incorrectpassword'
        }

        const response = await api
            .post('/login')
            .send(user)
            .expect(401)

        const error = response.body.error
        expect(error).toEqual('invalid username or password')
    })

    test('fails with missing data', async () => {
        const response = await api
            .post('/login')
            .send({})
            .expect(400)

        const error = response.body.error
        expect(error).toEqual('missing credentials')
    })
})