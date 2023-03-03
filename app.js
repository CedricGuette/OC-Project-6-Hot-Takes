const express = require('express')
const mongoose = require('mongoose') // used to communicate with MongoDb
const path = require('path') // used to pathing the app
// importing routes
const sauceRoutes = require('./routes/sauce')
const userRoutes = require('./routes/user')
// initializing express.js
const app = express()

mongoose.set("strictQuery", false)
// Connecting to mongoDB with API key
mongoose.connect ('mongodb+srv://Admin:ng07Rudkxh8UZjUx@cluster0.sya8m9e.mongodb.net/?retryWrites=true&w=majority',
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
// Adding pathes to requests
app.use('/api/sauces', sauceRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
