const routes = require('express').Router()
const mongoose = require('mongoose')
const ProductModel = require('../models/products')
const authMiddleware = require('../middlewares/authenticate')

routes.get('/', async (req, res) => {
    let { page } = req.query
    let { limit } = req.query

    if (!page) {
        page = 1
    }

    if (!limit) {
        limit = 9
    }

    try {
        const startIndex = (Number(page) - 1) * limit

        const total = await ProductModel.countDocuments({})
        const products = await ProductModel.find()
            .sort({ _id: -1 })
            .limit(limit)
            .skip(startIndex)

        if (!products) {
            return res.status(200).send({
                status: 'Failed',
                error: 'No products found',
            })
        }

        res.json({
            products,
            page: Number(page),
            numberOfPages: Math.ceil(total / limit),
        })
    } catch (error) {
        res.status(404).send({
            status: 'Failed',
            error: 'Please fill all fields',
        })
    }
})

routes.get('/get-all', async (req, res) => {
    const products = await ProductModel.find()

    if (!products) {
        return res.status(200).send({
            status: 'Failed',
            error: 'No products found',
        })
    }

    res.json(products)
})

routes.get('/search', async (req, res) => {
    const { search } = req.query

    try {
        const title = new RegExp(search, 'i')

        const products = await ProductModel.find({ $or: [{ title }] })

        res.send(products)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

routes.post('/create', authMiddleware, async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Please fill all fields',
        })
    }

    const productExist = await ProductModel.findOne({ title })

    if (productExist) {
        return res.status(400).send({
            status: 'Failed',
            error: 'Product already exists!',
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
