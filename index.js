const express = require("express")
const app = express()
app.use(express.static("build"))
const bodyParser = require("body-parser")
const morgan = require("morgan")
app.use(bodyParser.json())
const cors = require("cors")
app.use(cors())
morgan.token("content", function (req, res) { 
    const body = req.body || {}
    return JSON.stringify(body) 
})
app.use(morgan(":method :url :content :status :res[content-length] - :response-time ms"
))
const Person = require("./models/person")

app.get("/", (req, res) => {
    res.send("<h1>Hello World!</h1>")
})

app.get("/api/persons", (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(person=>Person.format(person)))
        })
})

app.get("/api/persons/:id", (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if(person) {
                res.json(Person.format(person))
            } else {
                res.status(404).send({message:"person not found"})
            }
        })  
})

app.get("/info", (req, res) => {
    Person
        .find({})
        .then(persons => {
            const sum = persons.length
            const date = new Date() 
            res.send("<p>puhelinluettelossa " + sum + " ihmisen tiedot<p><p>"+ date +"</p>")
        })
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findByIdAndDelete(id)
        .then(response => {
            res.status(204).end()
        })
})

app.post("/api/persons/", (req, res) => {
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    })
    Person.findOne({name:req.body.name})
        .then(response => {
            if(response) {
                res.status(405).send({message:"Person is already in list. You should use PUT to update."})
            } else {
        
                person.save()
                    .then(person => {
                        console.log("lisätään henkilö " + person.name + " numero " + person.number + " luetteloon")
                        res.json(Person.format(person))
                    })
            }
        })

})
  

app.put("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findByIdAndUpdate(id)
        .then(person => {
            console.log("muutetaan henkilölle " + person.name + " numero " + person.number + " luetteloon")
            res.json(Person.format(person))
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
