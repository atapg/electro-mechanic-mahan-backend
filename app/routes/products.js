const routes = require('express').Router()
const mongoose = require('mongoose')
const ProductModel = require('../models/products')
const authMiddleware = require('../middlewares/authenticate')
const upload = require('../utils/multer')

routes.get('/', async (req, res) => {
    const products = await ProductModel.find()

    if (!products) {
        return res.status(200).send({
            status: 'Failed',
            error: 'No products found',
        })
    }

    res.json(products)
})

routes.post('/create', authMiddleware, async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Please fill all fields',
        })
    }

    const product = await ProductModel.create(req.body)

    if (!product) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Something went wrong!',
        })
    }

    res.status(201).send(product)
})

routes.get('/:id', async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product not found!',
        })
    }

    const product = await ProductModel.findById(id)

    if (!product) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product not found!',
        })
    }

    res.send(product)
})

routes.delete('/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product not found!',
        })
    }

    const product = await ProductModel.findByIdAndDelete(id)

    if (!product) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product not found!',
        })
    }

    res.send({
        status: 'Success',
    })
})

routes.patch('/update/:id', authMiddleware, async (req, res) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product not found!',
        })
    }

    const product = await ProductModel.findByIdAndUpdate(id, req.body)

    if (!product) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product not found!',
        })
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body)

    res.send(updatedProduct)
})

module.exports = routes
