const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

const { OPEN_CAGE_API_KEY, GOOGLE_PLACES_API_KEY, GOOGLE_PLACES_URL } = process.env

router.post('/', (req, res) => {
  const { location } = req.body

  const getLocation = location => {
    const OPEN_CAGE_URL = `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${OPEN_CAGE_API_KEY}`

    return fetch(OPEN_CAGE_URL)
      .then(res => res.json())
      .then(data => data.results[0].geometry)
      .catch(error => {
        console.error('Error during API request:', error)
        throw error
      })
  }
  
  const getAttractions = ({ lat, lng }) => {
    const location = {
      latitude: lat,
      longitude: lng
    }
        
    const textQuery = 'attractions'
    const languageCode = 'en'
    const includedType = 'tourist_attraction'
    const priceLevels = ['INEXPENSIVE', 'MODERATE', 'EXPENSIVE', 'VERY_EXPENSIVE']
  
    const request = {
      textQuery,
      languageCode,
      includedType,
      priceLevels,
      locationBias: {
        circle: {
          center: location,
          radius: 1000 // Radius in meters
        }
      }
    }
        
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.priceLevel,places.websiteUri,places.rating,places.reviews'
      },
      body: JSON.stringify(request)
    }
        
    return fetch(GOOGLE_PLACES_URL, options)
      .then(response => response.json())
      .then(data => data.places)
      .catch(error => {
        console.error('Error during API request:', error)
        throw error
      })
  }

  getLocation(location)
    .then(coordinates => getAttractions(coordinates))
    .then(attractions => res.json(attractions))
})

module.exports = router