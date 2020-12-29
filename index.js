const express = require('express')
const morgan = require('morgan')
const path = require('path')
const app = express()

const Person = require('./models/person')

morgan.token('post-data', (request) => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data', {
  skip: (request) => request.method !== 'POST'
}))

app.get('/info', (request, response) => {
  const date = new Date
  Person.collection.countDocuments()
    .then(count => {
      const info = `<p>Phonebook has info for ${count} people.</p>
      <p>${date}</p>`

      response.send(info)
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(result => {
      response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(result => {
      if (result) {
        response.json(result)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const responseObj = request.body
  if (responseObj.name === undefined || responseObj.number === undefined) {
    return response.status(400).json({
      error: 'name or number field was not provided'
    })
  }

  const newPerson = new Person({
    name: responseObj.name,
    number: responseObj.number
  })

  newPerson.save()
    .then(savedEntry => savedEntry.toJSON())
    .then(formattedPerson => {
      response.json(formattedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const entryContent = request.body
  const updatedEntry = {
    name: entryContent.name,
    number: entryContent.number
  }

  const updateOpts = { new: true, runValidators: true, context: 'query' }
  Person.findByIdAndUpdate(request.params.id, updatedEntry, updateOpts)
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  console.log(request)
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else
  if (error.name === 'ValidationError') {
    console.log(request.body)
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})