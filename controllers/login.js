const config = require('../utils/config')
const encodeBase64 = require('../utils/encoder')

const loginRouter = require('express').Router()

const orm = require('../utils/model')
const User = orm.model('User')

loginRouter.post('/', async (request, response) => {
    const userId = (request.body.username) ? await User.findOne({ where: { username: request.body.username } }).id : null
    request.oauth2.model.accessToken.fetchByUserIdClientId(userId, config.CLIENT_ID, (err, accessToken) => {
        if (accessToken) {
            console.log('found accessToken')
            request.oauth2.model.accessToken.checkTTL(accessToken, (err, tokenActive) => {
                if (tokenActive) {
                    response.status(200).json({
                        token_type: 'bearer',
                        access_token: accessToken.token,
                        expires_in: request.oauth2.model.accessToken.ttl
                    })
                }
                else {
                    request.headers.authorization = 'Basic ' + encodeBase64(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
                    request.oauth2.controller.token(request, response)
                }
            })
        }
        else {
            request.headers.authorization = 'Basic ' + encodeBase64(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
            request.oauth2.controller.token(request, response)
        }
    })
})

module.exports = loginRouter