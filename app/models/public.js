const mongoose = require("mongoose");

const PublicModel = mongoose.Schema({
  phone: Number,
  phone2: Number,
  telephone: Number,
  address: String,
  name: String,
  lastName: String,
  email: String,
  title: String,
  brand: String,
  brandPer: String,
  socials: Array,
  logo: String,
  hero_bg: String,
  nav_items: Array,
  typings: Array,
  about: String,
});

module.exports = mongoose.model("public", PublicModel);
