require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const axios = require('axios')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

require('./app/config/mongodb')

app.use('/api/products', require('./app/routes/products'))
app.use('/api/admins', require('./app/routes/admins'))
app.use('/api/upload', require('./app/routes/files'))

const port = process.env.PORT || 8585

app.listen(port, () => console.log(`Server running on port ${port}`))
