require('dotenv').config()
const mongoose = require('mongoose');

const url = process.env.MONGO_URI

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
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)