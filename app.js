const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const connectionOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
}
mongoose.connect(config.MONGO_URI, connectionOpts)
  .then(() => {
    logger.info('Connected successfully to MongoDB!')
  })
  .catch(error => {
    logger.info('Conenction to MongoDB failed. Error:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms - Body: :post-data', {
  skip: (request) => request.method !== 'POST'
}))

app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app