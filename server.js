const express = require('express')
const cors = require('cors')
const sessions = require('./middlewares/sessions')
const app = express()
const port = process.env.PORT || 3001

app.listen(port, () => console.log(`Server is listening here: http://localhost:${port}`))

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())
app.use(sessions)

// Import routes
const sessionsRouter = require('./routes/sessions')
const usersRouter = require('./routes/users')
const attractionsRouter = require('./routes/attractions')
const googleRouter = require('./routes/google')

// Use routes
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/attractions', attractionsRouter)
app.use('/api/google', googleRouter)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const path = require('path')
    app.use(express.static(path.join(__dirname, 'build')));
  
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}