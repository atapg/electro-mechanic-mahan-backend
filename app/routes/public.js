const routes = require('express').Router()
const PublicModel = require('../models/public')

routes.get('/', (req, res) => {
    PublicModel.find()
        .then((result) => {
            return res.json(result[0])
        })
        .catch(() => {
            return res.status(400).send({
                status: 'Failed',
                error: 'Something went wrong!',
            })
        })
})

module.exports = routes
