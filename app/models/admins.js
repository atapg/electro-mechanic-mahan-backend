const mongoose = require('mongoose')

const UserModel = mongoose.Schema({
    name: String,
    lastName: String,
    phone: Number,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model('admin', UserModel)
