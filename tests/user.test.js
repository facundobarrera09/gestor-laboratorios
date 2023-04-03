const bcrypt = require('bcrypt')

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
})

describe('when there is initially two users in the database', () => {
    beforeEach(async () => {
        await orm.getSequelize().authenticate()

        await User.destroy({
            truncate: true
        })

        await User.create({
            username: 'james',
            passwordHash: await bcrypt.hash('password', 10)
        })
        await User.create({
            username: 'austin',
            passwordHash: await bcrypt.hash('password', 10)
        })
    })

    describe('creation of a new user', () => {
        test('succeeds with valid data', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUserData = {
                username: 'ramiro',
                password: 'password'
            }

            const response = await api
                .post('/users')
                .send(newUserData)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const newUser = response.body

            const usersAtEnd = await helper.usersInDb()
            const usernames = usersAtEnd.map(user => user.username)

            expect(usernames).toContain(newUser.username)
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        })

        test('fails with missing data', async () => {
            const usersAtStart = await helper.usersInDb()

            await api
                .post('/users')
                .send({})
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            expect(usersAtStart).toEqual(usersAtEnd)
        })

        test('fails with missing password', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUserData = {
                username: 'latar',
            }

            await api
                .post('/users')
                .send(newUserData)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()

            expect(usersAtStart).toEqual(usersAtEnd)
        })

        test('fails if username already exists', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUserData = {
                username: 'james',
                password: 'password'
            }

            const response = await api
                .post('/users')
                .send(newUserData)
                .expect(400)

            const error = response.body.error
            const usersAtEnd = await helper.usersInDb()

            expect(usersAtStart).toEqual(usersAtEnd)
        })
    })
})