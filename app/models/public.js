const mongoose = require('mongoose')

const PublicModel = mongoose.Schema({
    siteInfo: { String },
})

module.exports = mongoose.model('public', PublicModel)
