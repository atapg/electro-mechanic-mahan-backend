const routes = require('express').Router()
const AdminsModel = require('../models/admins')
const authMiddleware = require('../middlewares/authenticate')
const adminValidator = require('../validations/admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticate = require('../middlewares/authenticate')

routes.post('/login', async (req, res) => {
    const { email, phone, password } = req.body

    let admin

    if (email) admin = await AdminsModel.findOne({ email })
    else admin = await AdminsModel.findOne({ phone })

    if (!admin) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Something went wrong!',
        })
    }

    const correctPass = await bcrypt.compare(password, admin.password)

    if (!correctPass) {
        return res.status(400).send({
            status: 'Failed',
            error: 'incorrect credentials!',
        })
    }

    const token = jwt.sign({ id: admin._id }, process.env.SECRET, {
        expiresIn: '7d',
    })

    res.send({
        admin,
        token,
    })
})

routes.post('/register', authMiddleware, async (req, res) => {
    const { phone, email, name, password, lastName } = req.body

    if (!adminValidator(req.body)) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Please fill all fields',
        })
    }

    const existedUser = await AdminsModel.findOne({ phone, email })

    if (existedUser) {
        return res.status(400).send({
            status: 'Failed',
            error: 'User already exist!',
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await AdminsModel.create({
        name,
        lastName,
        password: hashedPassword,
        email,
        phone,
    })

    if (!admin) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Something went wrong!',
        })
    }

    res.send({
        status: 'Success',
    })
})

routes.delete('/delete', authMiddleware, async (req, res) => {
    const deleted = await AdminsModel.findByIdAndRemove(
        req.authenticatedUser._id,
        req.body
    )

    if (!deleted) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Something went wrong!',
        })
    }

    res.send({
        status: 'Success',
    })
})

routes.patch('/update', authMiddleware, async (req, res) => {
    const updated = await AdminsModel.findByIdAndUpdate(
        req.authenticatedUser._id,
        req.body
    )

    if (!updated) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Something went wrong!',
        })
    }

    res.send({
        status: 'Success',
    })
})

module.exports = routes
