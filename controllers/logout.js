const logoutRouter = require('express').Router()
const logger = require('../utils/logger')

logoutRouter.post('/', async (request, response) => {
    request.session.accessToken = undefined
    request.oauth2.model.accessToken.deleteByToken(request.oauth2.accessToken.token, (err, deleted) => {
        if (deleted) {
            return response.status(200).json({ message: 'session was closed' })
        }
        else {
            return response.status(400).json({ error: 'session was already closed or did not exist' })
        }
    })
    logger.info('User logged out')
})

module.exports = logoutRouter