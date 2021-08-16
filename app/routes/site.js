const routes = require('express').Router()
const authMiddleware = require('../middlewares/authenticate')
const publicModel = require('../models/public')

routes.patch('/', authMiddleware, async (req, res) => {
    const settings = req.body

    const x = await publicModel.findOne()

    publicModel.findByIdAndUpdate(x._id, settings, (err, result) => {
        if (err) {
            return res.status(400).send({
                status: 'Failed',
                error: 'Something went wrong!',
            })
        }

        res.send('Success')
    })
})

module.exports = routes
