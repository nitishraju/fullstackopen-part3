const express = require('express');
const app = express()

app.use(express.json())

let persons = [
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

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date
  const info= `<p>Phonebook has info for ${persons.length} people.</p>
  <p>${date}</p>`

  res.send(info)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})