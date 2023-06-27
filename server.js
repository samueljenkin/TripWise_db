const express = require('express')
const cors = require('cors')
const router = express.Router()
const bcrypt = require('bcrypt')

// middlewares
const sessions = require('./middlewares/sessions')

// controllers
// const usersController = require('./controllers/users_controller')
// const sessionsController = require('./controllers/sessions_controller')

const app = express()
const port = process.env.PORT || 3001

// start web server
app.listen(port, () => console.log(`Server is listening here: http://localhost:${port}`))

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(sessions)

// models
const User = require('./models/user')
const Attraction = require('./models/attraction')

// routes - sessions
app.post('/api/sessions', (req, res) => {
    const { email, password } = req.body

    User
        .findByEmail(email)
        .then(user => {
            if (!user || email == '' || password == '') {
                res.status(400).json({ error: 'email and/or password are incorrect' })
            } else {
                const isValidPassword = bcrypt.compareSync(password, user.password_digest)

                if (user && isValidPassword) {
                    req.session.userId = user.id
                    res.json(user)
                }
            }
        })
})

app.get('/api/sessions', (req, res) => {
    const userId = req.session.userId 

    if (userId) {
        User
            .findById(userId)
            .then(user => res.json({ user: user }))
    } else {
        res.json({})
    }
})

app.delete('/api/sessions', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(400).json({ error: 'failed to log out' })
        } else {
            res.clearCookie('user_sid')
            res.json({ message: 'success' })
        }
    })
})

// routes - users
app.post('/api/users', (req, res) => {
    const { name, email, password } = req.body
    const passwordDigest = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)

    User
        .create(name, email, passwordDigest)
        .then(user => {
            req.session.userId = user.id
            res.json(user)
        })
})

// routes - attractions
app.post('/api/attractions', (req, res) => {
    const userId = req.session.userId
    const { displayName, websiteUri, priceLevel, rating } = req.body
    
    Attraction
        .addAttraction(userId, displayName.text, websiteUri, priceLevel, rating)
        .then(attraction => res.json(attraction))
})

app.get('/api/attractions', (req, res) => {
    const userId = req.session.userId

    Attraction
        .getAttractions(userId)
        .then(attractions => res.json(attractions))
})

if (process.env.NODE_ENV === 'production') {
    const path = require('path')
    app.use(express.static(path.join(__dirname, 'build')));
  
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// app.use('api/users', usersController)
// app.use('api/sessions', sessionsController)