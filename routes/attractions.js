const express = require('express')
const router = express.Router()
const Attraction = require('../models/attraction')

router.get('/', (req, res) => {
  const userId = req.session.userId

  Attraction
    .getAttractions(userId)
    .then(attractions => res.json(attractions))
})

router.post('/', (req, res) => {
  const userId = req.session.userId
  const { tripId, displayName, websiteUri, priceLevel, rating } = req.body
  
  Attraction
    .addAttraction(userId, tripId, displayName.text, websiteUri, priceLevel, rating)
    .then(attraction => res.json(attraction))
})

module.exports = router