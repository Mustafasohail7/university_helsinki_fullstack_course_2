const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Phonebook = require('./models/phone')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(cors())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(result => {
        console.log(result)
        response.json(result)
    })
})

app.get('/api/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id).then(result => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Phonebook.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
 
app.post('/api/persons', (request, response,next) => {
    const body = request.body
  
    if (!body.name && !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    // if(persons.find(note => note.name === body.name)) {
    //     return response.status(400).json({ 
    //         error: 'name must be unique' 
    //     })
    // }
  
    const person = new Phonebook({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedNote => {
      response.json(savedNote)
    }).catch(error => next(error))
  })

app.put('/api/persons/:id', (request, response, next) => {

  const { content, important } = request.body

  Phonebook.findByIdAndUpdate(request.params.id, {
    content,
    important,
  } , { new: true, runValidators: true, context: 'query'})
  .then(undefined => {
    response.json(undefined)
  })
  .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})