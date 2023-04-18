const mongoose = require('mongoose')
const Schema = mongoose.Schema
const urlSchema = new Schema ({
  origUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Url', urlSchema)