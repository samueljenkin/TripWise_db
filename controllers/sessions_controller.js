const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

// models
const User = require('../models/user')

// routes
router.post('/', (req, res) => {
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
                    res.json(user.email)
                }
            }
        })
})

router.get('/', (req, res) => {
    const userId = req.session.userId 

    if (userId) {
        User
            .findById(userId)
            .then(email => res.json({ result: 'successful', email: email }))
    } else {
        res.json({})
    }
})

router.delete('/', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            res.status(400).json({ error: 'failed to log out' })
        } else {
            res.clearCookie('user_sid')
            res.json({ message: 'success' })
        }
    })
})

module.exports = router