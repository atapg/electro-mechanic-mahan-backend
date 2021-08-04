const AdminsModel = require('../models/admins')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    //check if there is any header for token or not
    if (!req.headers.authorization) {
        return res.status(401).send({
            message: 'Failed',
            status: 'Unauthorized',
        })
    }

    //check well if there is any header for token or not
    const authorizationParse = req.headers.authorization.split(' ')

    if (authorizationParse.length < 2) {
        return res.status(401).send({
            message: 'Failed',
            status: 'Unauthorized',
        })
    }

    //get token
    const token = authorizationParse[1]

    //get user id from token
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: 'Failed',
                status: 'Unauthorized',
            })
        }

        //get current user
        const authUser = await AdminsModel.findOne({
            _id: decoded.id,
        }).select('-password')

        if (!authUser) {
            return res.status(401).send({
                message: 'Failed',
                status: 'Unauthorized',
            })
        }

        req.authenticatedUser = authUser
        next()
    })
}
