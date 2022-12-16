require('dotenv').config()
const cors = require('cors')
const port = process.env.WEBAPI_PORT || 5000
const initMongoDB = require('./server-mongodb')
const express = require('express')
const app = express()


// middleware       (system -> middleware -> app)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

// routes/controllers
app.use('/api/products', require('./controllers/productsController'))


// initialize
initMongoDB()
app.listen(port, () => console.log(`Web Api is running on http://localhost:${port}`))









