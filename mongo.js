const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else
if (process.argv.length > 5) {
  console.log('More arguments than usable have been provided.')
  console.log('Ensure that names with whitespaces are enclosed in quotes.')
  process.exit(1)
}

const password = process.argv[2]
const numArgs = process.argv.length


const url = `mongodb+srv://nitish:${password}@cluster0.gtg1i.mongodb.net/phonebook-app?retryWrites=true&w=majority`

const mongooseSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

mongoose.connect(url, mongooseSettings)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (numArgs === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(`${person.name}: ${person.number}`)
    })
    mongoose.connection.close()
    process.exit(0)
  })

} else
if (numArgs === 5) {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson.save().then(response => {
    console.log(`The entry for ${response.name} with number ${response.number} has been added.`)
    mongoose.connection.close()
    process.exit(0)
  })
}
else {
  console.log('The correct number was arguments was not provided. Please recheck your arguments.')
  mongoose.connection.close()
  process.exit(1)
}