const express = require('express')
const mongoose = require('mongoose') // used to communicate with MongoDb
const path = require('path') // used to pathing the app
const rateLimit = require('express-rate-limit')
require('dotenv').config()
// importing routes
const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')
// initializing express.js
const app = express()

mongoose.set("strictQuery", false)
// Connecting to mongoDB with API key
mongoose.connect (process.env.API_MONGODB,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})
// Anti bruteforce
const loginLimiter = rateLimit({
  windowMs : 10 * 60 * 1000, // Time limitation 10 minutes here
  max: 5, // Limiting 5 tries by IP per windowMs time limitation
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

// Adding pathes to requests
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', loginLimiter, userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
