const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.post('/', (req, res) => {
  const { username, email, password } = req.body
  const passwordDigest = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null)

  User
    .create(username, email, passwordDigest)
    .then(user => {
      req.session.userId = user.id
      res.json(user.username)
    })
})

module.exports = router