const logger = require('../utils/logger')
const morgan = require('morgan')

morgan.token('post-data', (request) => {
  return JSON.stringify(request.body)
})

const unknownEndpoint = (request, response) => {
  logger.info(request)
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else
  if (error.name === 'ValidationError') {
    logger.error(request.body)
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { morgan, unknownEndpoint, errorHandler }