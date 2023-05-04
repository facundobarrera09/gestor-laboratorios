const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('╔═════════════')
    logger.info('║ Method:     ', request.method)
    logger.info('║ Path:       ', request.path)
    logger.info('║ Body:       ', request.body)
    logger.info('║ Authorized: ', request.session.accessToken ? true : false)
    logger.info('╚═════════════')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (response.writableEnded) return next()

    // handle errors
    // console.log(error)
    // console.log(error.name, ':', error.message)
    if (error.name === 'SequelizeValidationError') {
        if (error.message.includes('length')) {
            response.status(400).send({ error: 'username must be between 5 and 16 characters long' })
        }
        else if (error.message.includes('notNull Violation')) {
            response.status(400).send({ error: 'username, password, or role missing' })
        }
    }
    else if (error.name === 'JsonWebTokenError') {
        response.status(401).send({ error: 'jwt must be provided' })
    }
    else if (error.name === 'TokenExpiredError') {
        response.status(401).send({ error: 'jwt expired' })
    }
    else if (error.name === 'Error') {
        if (error.message === 'data and salt arguments required') {
            response.status(400).send({ error: 'username, password, or role missing' })
        }
        else if (error.message.includes('unauthorized')) {
            response.status(401).send({ error: 'not authorized to perform that action' })
        }
    }
    else if (error.name === 'SequelizeUniqueConstraintError') {
        response.status(400).send({ error: 'username already in use' })
    }

    response.status(500).json({ error: 'unknown error occurred' })

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}