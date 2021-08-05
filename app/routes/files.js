const routes = require('express').Router()
const upload = require('../utils/multer')
const ProductModel = require('../models/products')
const authMiddleware = require('../middlewares/authenticate')
const mongoose = require('mongoose')

routes.post(
    '/images/:id',
    authMiddleware,
    (req, res, next) => {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send({
                status: 'Failed',
                error: 'Product not found!',
            })
        }

        next()
    },
    upload.array('images'),
    async (req, res) => {
        const { id } = req.params

        const product = await ProductModel.findById(id)

        const images = product.images

        req.files.forEach((img) => {
            images.push(`${process.env.BACKEND_URL}/${img.filename}`)
        })

        ProductModel.findByIdAndUpdate(id, { images }, (err, result) => {
            if (err) {
                return res.status(400).send({
                    status: 'Failed',
                    message: 'Something went wrong!',
                })
            }
        })

        try {
            res.json({
                status: 'Success',
                uploaded: true,
                url: req.files,
            })
        } catch (error) {
            res.json({
                status: 'Failed',
                error,
            })
        }
    }
)

routes.delete(
    '/images',
    authMiddleware,
    (req, res, next) => {
        if (!mongoose.isValidObjectId(req.body.product_id)) {
            return res.status(400).send({
                status: 'Failed',
                error: 'Product not found!',
            })
        }

        next()
    },
    // upload.array('images'),
    async (req, res) => {
        const { img_url, product_id } = req.body

        const product = await ProductModel.findById(product_id)

        const images = product.images

        if (!images) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Something went wrong!',
            })
        }

        //delete img from array
        const index = images.findIndex((i) => i === img_url)

        if (index <= -1) {
            return res.status(400).send({
                status: 'Failed',
                message: 'Something went wrong!',
            })
        }

        images.splice(index, 1)

        ProductModel.findByIdAndUpdate(
            product_id,
            { images },
            (err, result) => {
                if (err) {
                    return res.status(400).send({
                        status: 'Failed',
                        message: 'Something went wrong!',
                    })
                }
            }
        )

        try {
            res.json({
                status: 'Success',
                uploaded: true,
                url: req.files,
            })
        } catch (error) {
            res.json({
                status: 'Failed',
                error,
            })
        }
    }
)

module.exports = routes
