const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/', (req, res) => {
  const userId = req.session.userId 

  if (userId) {
    User
      .findById(userId)
      .then(user => res.json(user.username))
  } else {
    res.json(null)
  }
})

router.post('/', (req, res) => {
  const { email, password } = req.body

  User
    .findByEmail(email)
    .then(user => {
      const validPassword = user 
        ? bcrypt.compareSync(password, user.password_digest)
        : false

      if (!user || !email || !password || !validPassword) {
        res.json({ error: 'Incorrect email/password. Please try again.' })
      } else {
        req.session.userId = user.id
        res.json(user)
      }
    })
})

router.delete('/', (req, res) => {
  req.session.destroy(() => res.clearCookie('user_sid'))
})

module.exports = router