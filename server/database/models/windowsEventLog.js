const mongoose = require('mongoose')

const definition = {
  eventId: { type: String, required: true },
  priority: { type: String, required: true },
  summary: { type: String, default: '' }
}

const options = { timestamps: true }

const windowsEventLogShema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('WindowsEventLog', windowsEventLogShema)
