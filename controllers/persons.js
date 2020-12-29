const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/info', (request, response) => {
  const date = new Date
  Person.collection.countDocuments()
    .then(count => {
      const info = `<p>Phonebook has info for ${count} people.</p>
      <p>${date}</p>`

      response.send(info)
    })
})

personsRouter.get('/', (request, response) => {
  Person.find({})
    .then(result => {
      response.json(result)
    })
})

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
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

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter