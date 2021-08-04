const routes = require('express').Router()
var mongoose = require('mongoose')
const ProductModel = require('../models/product')

routes.get('/', async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
})

routes.post('/create', async (req, res) => {
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

routes.delete('/:id', async (req, res) => {
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

routes.patch('/:id', async (req, res) => {
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
