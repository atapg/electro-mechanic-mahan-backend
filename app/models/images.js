const mongoose = require("mongoose")

const ImageModel = mongoose.Schema({
    url: String,
})

module.exports = mongoose.model("image", ImageModel)
