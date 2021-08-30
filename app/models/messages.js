const mongoose = require("mongoose");

const MessagesSchema = mongoose.Schema({
  email: String,
  text: String,
  phone: String,
  time: {
    type: Date,
    default: new Date(),
  },
  answered: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("message", MessagesSchema);
