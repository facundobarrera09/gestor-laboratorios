const orm = require('../utils/model')
const User = orm.model('User')

const setUsersTable = async () => {
    await orm.getSequelize().sync({ force: true })
}

const usersInDb = async () => {
    const allUsers = await User.findAll()
    return allUsers
}

module.exports = {
    setUsersTable, usersInDb
}