const config = require('../utils/config')

const orm = require('../utils/model')
const User = orm.model('User')
const Turn = orm.model('Turn')
const Laboratory = orm.model('Laboratory')

const sequelize = orm.getSequelize()

const syncDatabase = async () => {
    await sequelize.authenticate()
    await sequelize.sync({ force: true })
}

const usersInDb = async (raw) => {
    raw = raw ? raw : false
    const allUsers = await User.findAll({ raw })
    return allUsers
}

const turnsInDb = async (raw) => {
    raw = raw ? raw : false
    const allTurns = await Turn.findAll({ raw })
    return allTurns
}

const laboratoriesInDb = async (raw) => {
    raw = raw ? raw : false
    const allLabs = await Laboratory.findAll({ raw })
    return allLabs
}

const loginAs = async (api, username, password) => {
    const loginData = await api
        .post('/api/login')
        .send({
            grant_type: 'password',
            scope: 'read write',
            username,
            password
        })
        .set('Content-Type', 'application/json')

    return {
        username,
        password,
        token: loginData.body.data.access_token
    }
}

const truncateTables = async (models) => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })

    models = models ? models : ['User', 'Turn', 'Laboratory']

    await Promise.all(models.map(async (modelName) => {
        await orm.model(modelName).destroy({
            where: {},
            force: true,
        })
    }))

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
}

module.exports = {
    syncDatabase, usersInDb, turnsInDb, laboratoriesInDb, loginAs, truncateTables
}