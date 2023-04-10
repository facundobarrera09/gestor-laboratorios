const jwt = require('jsonwebtoken')
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

const usersInDb = async () => {
    const allUsers = await User.findAll()
    return allUsers
}

const turnsInDb = async () => {
    const allTurns = await Turn.findAll()
    return allTurns
}

const laboratoriesInDb = async () => {
    const allLabs = await Laboratory.findAll()
    return allLabs
}

const loginAs = async (username) => {
    const user = await User.findOne({ where: { username } })

    if (!user) {
        throw new Error('user does not exist')
    }

    const userForToken = {
        id: user.id,
        username: user.username,
    }

    const token = jwt.sign(
        userForToken,
        config.SECRET,
        { expiresIn: 60*60 }
    )

    return {
        id: user.id,
        username: user.username,
        token
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