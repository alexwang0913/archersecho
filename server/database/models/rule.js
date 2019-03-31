const mongoose = require('mongoose')

const definition = {
  name: { type: String, require: true }
}

const options = {
  timestamps: true
}

const ruleSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('Rule', ruleSchema)
