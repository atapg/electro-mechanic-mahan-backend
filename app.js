require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('./app/config/mongodb')

app.use('/api/products', require('./app/routes/products'))

const port = process.env.PORT || 8585

app.listen(port, () => console.log(`Server running on port ${port}`))
