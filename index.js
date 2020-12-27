const express = require('express');
const morgan = require('morgan')
const app = express()

morgan.token('post-data', (req) => {
  return JSON.stringify(req.body)
}) 

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :post-data", {
  skip: (req, res) => req.method !== 'POST'
}))

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "123-456-7890"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "112-358-1321"
  },
  {
    id: 3,
    name: "Isaac Asimov",
    number: "246-369-4812"
  },
  {
    id: 4,
    name: "Mary Poppins",
    number: "000-000-0000"
  }
]

app.get('/info', (req, res) => {
  const date = new Date
  const info= `<p>Phonebook has info for ${phoneBook.length} people.</p>
  <p>${date}</p>`

  res.send(info)
})

app.get('/api/persons', (req, res) => {
  res.json(phoneBook)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = phoneBook.filter((personObj) => personObj.id === id)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  phoneBook = phoneBook.filter(personObj => personObj.id !== id)
  console.log(phoneBook);
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const responseObj = req.body

  const findDuplicate = phoneBook.find(personObj => personObj.name == responseObj.name)
  let errorMsg = findDuplicate
    ? 'name must be unique'
    : null
  errorMsg = responseObj.name === undefined || responseObj.number == undefined
    ? 'name or number is missing'
    : errorMsg

  if (errorMsg) {
    return res.status(400).json({
      error: errorMsg
    })
  }

  const randomId = Math.floor(Math.random()*1001)
  let newPerson = {id: randomId, ...req.body}
  phoneBook = [...phoneBook, newPerson]

  res.json(newPerson)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})