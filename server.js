const express = require('express')

// middlewares
const sessions = require('./middlewares/sessions')

// controllers
const usersController = require('./controllers/users_controller')
const sessionsController = require('./controllers/sessions_controller')

const app = express()
const PORT = 3001

// start web server
app.listen(PORT, () => console.log(`Server is listening here: http://localhost:${PORT}`))

app.use(express.json())
app.use(sessions)

app.use('api/users', usersController)
app.use('api/sessions', sessionsController)