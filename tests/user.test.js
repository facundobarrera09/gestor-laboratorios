let app, supertest, api, orm, helper, userController

beforeAll(async () => {
    app = require('../app')
    supertest = require('supertest')
    api = supertest(app)

    orm = require('../utils/model')

    await orm.getSequelize().authenticate()

    helper = require('./helper')
    await helper.setUsersTable()

    userController = require('../controllers/users')
})

describe('when there is initially two users in the database', () => {
    beforeEach(async () => {
        await orm.getSequelize().authenticate()

        await userController.truncate()

        await userController.create({ username: 'jane', password: 'password' })
        await userController.create({ username: 'austin', password: 'password' })
    })

    describe('creation of a new user', () => {
        test('succeeds with valid data', async () => {
            const usersAtStart = await helper.usersInDb()

            const newUserData = {
                username: 'ramiro',
                password: 'password'
            }

            const newUser = await userController.create(newUserData)

            const usersAtEnd = await helper.usersInDb()
            const usernames = usersAtEnd.map(user => user.username)

            expect(usernames).toContain(newUser.username)
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        })
    })
})