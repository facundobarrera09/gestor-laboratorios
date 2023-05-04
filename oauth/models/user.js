const bcrypt = require('bcrypt')

const orm = require('../../utils/model')
const User = orm.model('User')

module.exports.getId = function(user, cb) {
    cb(null, user.id)
}

module.exports.fetchById = async function(id, cb) {
    const user = await User.findOne({ where: { id } })
    if (user) return cb(null, user)
    cb()
}

module.exports.fetchByUsername = async function(username, cb) {
    const user = await User.findOne({ where: { username } })
    if (user) return cb(null, user)
    cb()
}

module.exports.checkPassword = async function(user, password, cb) {
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
    cb(null, isPasswordCorrect)
}

module.exports.fetchFromRequest = function(req, cb) {
    const token = req.session.accessToken
    req.oauth2.model.accessToken.fetchByToken(token, async (err, accessToken) => {
        let user
        if (accessToken) {
            await this.fetchById(accessToken.userId, (err, foundUser) => {
                user = foundUser
            })
        }
        cb(null, user)
    })
}