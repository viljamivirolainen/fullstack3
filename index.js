const express = require('express')
const app = express()
app.use(express.static('build'))
const bodyParser = require('body-parser')
const morgan = require('morgan')
app.use(bodyParser.json())
const cors = require('cors')
app.use(cors())
morgan.token('content', function (req, res) { 
  const body = req.body || {}
  return JSON.stringify(body) 
})
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'
))
const Person = require('./models/person')
const config = require('./config')
const url = 'mongodb://fullstack:'+config.password+'@ds155299.mlab.com:55299/puhelinluettelo'


/* let persons = [
      {
        "name": "ff",
        "number": "df",
        "id": 6
      },
      {
        "name": "VIljami",
        "number": "12312",
        "id": 8
      },
      {
        "name": "afff",
        "number": "324",
        "id": 9
      },
      {
        "name": "minä",
        "number": "432",
        "id": 10
      }
    ] */



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .catch(error=>console.log(error))
    .then(persons => {
      res.json(persons.map(person=>Person.format(person)))
    })
    .catch(error=>console.log(error))
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(Person.format(person))
      } else {
        res.status(404).send({message:'person not found'})
      }
    })  
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .catch(error=>console.log(error))
    .then(persons => {
      const sum = persons.length
      const date = new Date() 
      res.send('<p>puhelinluettelossa ' + sum + ' ihmisen tiedot<p><p>'+ date +'</p>')
    })
    .catch(error=>console.log(error))
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(response => {
      res.status(204).end()
    })
})

app.post('/api/persons/', (req, res) => {
  Person.find({name:req.body.name})
    .then(response => {
      if(response) {
        res.status(405).send({message:'Person is already in list. You should use PUT to update.'})
      } else {
        const person = new Person({
          name: req.body.name,
          number: req.body.number
        })
        person.save()
          .catch(error=>console.log(error))
          .then(person => {
            console.log('lisätään henkilö ' + person.name + ' numero ' + person.number + ' luetteloon')
            res.json(Person.format(person))
          })
          .catch(error=>console.log(error))
      }
      /* const id = Math.floor(Math.random()*Math.floor(1000000000)) */
      /* const personWithId = {name:name, number:number}
      persons.push(personWithId) */
    })
    })
  

app.put('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findByIdAndUpdate(id)
    .catch(error=>console.log(error))
    .then(person => {
      console.log('muutetaan henkilölle ' + person.name + ' numero ' + person.number + ' luetteloon')
      res.json(Person.format(person))
    })
    .catch(error=>console.log(error))
  /* const id = Math.floor(Math.random()*Math.floor(1000000000)) */
  /* const personWithId = {name:name, number:number}
  persons.push(personWithId) */
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
