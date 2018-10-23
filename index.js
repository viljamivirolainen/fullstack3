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
    .then(persons => {
      res.json(persons.map(person=>Person.format(person)))
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  Person.findById(id)
    .then(person => {
      if(person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })  
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      const sum = persons.length
      const date = new Date() 
      res.send('<p>puhelinluettelossa ' + sum + ' ihmisen tiedot<p><p>'+ date +'</p>')
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  Person.findByIdAndDelete(id)
  res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })
  person.save()
    .then(person => {
      console.log('lisätään henkilö ' + person.name + ' numero ' + person.number + ' luetteloon')
      res.json(Person.format(person))
    })
  /* const id = Math.floor(Math.random()*Math.floor(1000000000)) */
  /* const personWithId = {name:name, number:number}
  persons.push(personWithId) */
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
