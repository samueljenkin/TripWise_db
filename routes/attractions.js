const express = require('express')
const router = express.Router()
const Attraction = require('../models/attraction')

router.post('/', (req, res) => {
  const userId = req.session.userId
  const { tripId, displayName, websiteUri, priceLevel, rating } = req.body
  
  Attraction
    .saveAttraction(userId, tripId, displayName.text, websiteUri, priceLevel, rating)
    .then(attraction => res.json(attraction))
})

router.get('/', (req, res) => {
  const userId = req.session.userId

  Attraction
    .getSavedAttractions(userId)
    .then(attractions => res.json(attractions))
})

module.exports = router