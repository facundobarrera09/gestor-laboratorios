const config = require('../utils/config')
const encodeBase64 = require('../utils/encoder')

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
    request.headers.authorization = 'Basic ' + encodeBase64(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`)
    request.oauth2.controller.token(request, response)
})

module.exports = loginRouter