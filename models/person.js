const mongoose = require('mongoose')
const config = require('.././config')
const url = 'mongodb://fullstack:'+config.password+'@ds155299.mlab.com:55299/puhelinluettelo'

mongoose.connect(url)
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {name:person.name,number:person.number,id:person._id}
};

const Person = mongoose.model('Person', personSchema)
module.exports = Person