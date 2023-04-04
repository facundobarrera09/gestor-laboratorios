const orm = require('../utils/model')
const User = orm.model('User')
const Turn = orm.model('Turn')

const setUsersTable = async () => {
    await orm.getSequelize().sync({ force: true })
}

const usersInDb = async () => {
    const allUsers = await User.findAll()
    return allUsers
}

const turnsInDb = async () => {
    const allTurns = await Turn.findAll()
    return allTurns
}

module.exports = {
    setUsersTable, usersInDb, turnsInDb
}