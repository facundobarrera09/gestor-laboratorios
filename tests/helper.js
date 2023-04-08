const orm = require('../utils/model')
const User = orm.model('User')
const Turn = orm.model('Turn')

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

const truncateTables = async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })

    const models = [ 'User', 'Turn', 'Laboratory']
    models.forEach(async (modelName) => {
        orm.model(modelName).destroy({
            where: {},
            force: true,
        })
    })

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
}

module.exports = {
    syncDatabase, usersInDb, turnsInDb, truncateTables
}