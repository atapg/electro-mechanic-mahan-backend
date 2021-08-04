const mongoose = require('mongoose')

const ProductModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    images: [String],
    size: String,
    weight: String,
    speed: String,
})

module.exports = mongoose.model('product', ProductModel)
