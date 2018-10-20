const mongoose = require('mongoose')
const config = require('./config')
// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://fullstack:'+config.password+'@ds155299.mlab.com:55299/puhelinluettelo'

mongoose.connect(url)


const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const showPersons = () =>  {
  Person
  .find({})
  .then(result => {
    console.log('puhelinluettelo: ')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}

const savePerson = (name, number) => {
  
  const person = new Person({
    name: name,
    number: number
  })
  person
  .save()
  .then(response => {
    console.log('lisätään henkilö ' + person.name + ' numero ' + person.number + ' luetteloon')
    mongoose.connection.close()
  })
}


switch(process.argv.length){
  case 2: showPersons()
    break;
  case 4: savePerson(process.argv[2],process.argv[3])
    break;
}





