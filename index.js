const express = require('express')
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})