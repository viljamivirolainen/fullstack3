const express = require('express')
const app = express()
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


let persons = [
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
    ]



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  if(person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const sum = persons.length
  const date = new Date() 
  res.send('<p>puhelinluettelossa ' + sum + ' ihmisen tiedot<p><p>'+ date +'</p>')
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
  const person = req.body
  const name = person.name
  const number = person.number
  if(!person) {
    res.status(400).json({error: 'no person data received'})
  }
  if(!name) {
    res.status(400).json({error: 'name missing'})
  }
  if(!number) {
    res.status(400).json({error: 'number missing'})
  }

  if(persons.map(person=>person.name).includes(name)) {
    res.status(400).json({error: 'name must be unique'})
  }



  const id = Math.floor(Math.random()*Math.floor(1000000000))
  const personWithId = {name:name, number:number,id:id}
  persons.push(personWithId)
  res.json(personWithId)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
