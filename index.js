const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

morgan.token('personData', function(req, res) {
    if (req.method === "POST") {
        return JSON.stringify(req.body)
    } 
    return " "
    
});

let numbers= 
    [{
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {   
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122'
    }]

const createRandomId = () => {
    return Math.floor(Math.random() * 10000)
}

app.use(cors())

app.use(express.json())

app.use(express.static('dist'))

// tehtävä 3.8
// app.use(morgan('tiny'))

app.use(morgan(':method :url :status :res[content-length] :response-time ms :personData'))

app.get('/api/info', (request, response) => {
    let dateTime = new Date()
    let message = `<p>Phonebook has info for ${numbers.length} people</p><p>${dateTime}</p>`  
    response.send(message)
})

app.get('/api/persons', (request, response) => {
    response.json(numbers)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const number = numbers.find(number => number.id === id)
    if (number) {
        response.json(number)
        } else {
        response.status(404).end()
        }
})

 
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    numbers = numbers.filter(number => number.id !== id)

    response.status(204).end()
}) 

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }

    if (numbers.find(number => number.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const numberData = {
      id: createRandomId(),
      name: body.name,
      number: body.number
      
    }
  
    numbers = numbers.concat(numberData)
  
    response.json(numberData)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})