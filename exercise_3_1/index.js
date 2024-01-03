const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()
morgan.token('postrequest', (request) => JSON.stringify(request.body))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :postrequest'))
app.use(cors())
const logger = morgan('tiny')
let phonebook = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
  ]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)
})
app.get('/api/info', (request, response) => {
  response.send('<h1>Phonebook has info for ' + phonebook.length +  ' people</h1><br><h1>'+Date()+'</h1></br>' )
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const people = phonebook.find(people => people.id === id)
  response.json(people)
  if (people) {
    response.json(people)
  } else {
    response.status(404).end()
  }
})


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter(people => people.id !== id)

  response.status(204).end()
})
app.post('/api/persons', (request, response) => {
  const maxId = phonebook.length > 0
    ? Math.max(...phonebook.map(n => n.id)) 
    : 0

  const people = request.body
  people.id = maxId + 1
  const findName = (phonebook.find(person => person.name === people.name))
  if(findName == undefined){
    phonebook = phonebook.concat(people)
    response.json(people)
  }
  else if(findName.name == people.name){
      response.status(404).json({error: 'name must be unique'})
    }
  })
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})