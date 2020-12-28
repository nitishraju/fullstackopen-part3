const express = require('express');
const morgan = require('morgan');
const { count } = require('./models/person');
const app = express()

const Person = require('./models/person')

morgan.token('post-data', (request) => {
  return JSON.stringify(request.body)
}) 

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data", {
  skip: (request, response) => request.method !== 'POST'
}))

// app.get('/info', (request, response) => {
//   const date = new Date
//   const info= `<p>Phonebook has info for ${phoneBook.length} people.</p>
//   <p>${date}</p>`

//   response.send(info)
// })

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(phoneBook => {
      response.json(phoneBook)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(personObj => {
      response.json(personObj)
    })
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id)
//   phoneBook = phoneBook.filter(personObj => personObj.id !== id)
//   console.log(phoneBook);
//   response.status(204).end()
// })

app.post('/api/persons', (request, response) => {
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
    .then(savedEntry => {
      response.json(savedEntry.toJSON())
    })
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})