const bcrypt = require('bcrypt')

const orm = require('../utils/model')
const User = orm.model('User')

const truncate = async () => {
    await User.destroy({
        truncate: true
    })
}

const create = async ({ username, password }) => {
    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = await User.create({ username, passwordHash })
    return newUser
}

module.exports = {
    truncate,
    create
}