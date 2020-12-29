require('dotenv').config()
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGO_URI
console.log(url)

const mongooseSettings = { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}

mongoose.connect(url, mongooseSettings)
    .then(response => {
        console.log('Connected to MongoDB successfully.')
    })
    .catch(error => {
        console.log('Connection to MongoDB failed! Error:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  }
})
personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)