const routes = require('express').Router()
const upload = require('../utils/multer')
const ProductModel = require('../models/products')
const authMiddleware = require('../middlewares/authenticate')
const mongoose = require('mongoose')
const fs = require('fs')

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

        if (!req.files) {
            return res.status(400).send({
                status: 'Failed',
                error: 'There is no file!',
            })
        }

        const product = await ProductModel.findById(id)

        const images = product.images

        req.files.forEach((img) => {
            images.push(`${process.env.BACKEND_URL}/${img.filename}`)
        })

        ProductModel.findByIdAndUpdate(id, { images }, (err, result) => {
            if (err) {
                return res.status(400).send({
                    status: 'Failed',
                    error: 'Something went wrong!',
                })
            }
        })

        try {
            res.status(200).send({
                status: 'Success',
                uploaded: true,
                url: req.files,
            })
        } catch (error) {
            res.status(400).send({
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
    async (req, res) => {
        const { product_id, img_url } = req.body

        const product = await ProductModel.findById(product_id)

        const images = product.images

        if (!images) {
            return res.status(400).send({
                status: 'Failed',
                error: 'Something went wrong!',
            })
        }

        if (!product.images.includes(img_url)) {
            return res.status(400).send({
                status: 'Failed',
                error: 'Something went wrong!',
            })
        }

        //delete img from array
        const index = images.findIndex((i) => i === img_url)

        if (index <= -1) {
            return res.status(400).send({
                status: 'Failed',
                error: 'Something went wrong!',
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
                        error: 'Something went wrong!',
                    })
                }
            }
        )

        const backendLength = process.env.BACKEND_URL.length + 1
        const urlLength = img_url.length - backendLength
        const file_name = img_url.substr(backendLength, urlLength)
        const path = `./public/${file_name}`

        if (!fs.existsSync(path)) {
            return res.status(400).send({
                status: 'Failed',
                error: 'File does not exists!',
            })
        }

        fs.unlink(path, (err) => {
            if (err) {
                return res.status(400).send({
                    status: 'Failed',
                    error: 'Something went wrong!',
                })
            }
        })

        try {
            return res.status(200).send({
                status: 'Success',
                uploaded: true,
                url: req.files,
            })
        } catch (error) {
            return res.status(200).send({
                status: 'Failed',
                error,
            })
        }
    }
)

module.exports = routes
