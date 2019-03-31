const mongoose = require('mongoose')

const definition = {
  date: { type: Date, default: Date.now() },
  onlineSeconds: { type: Number, default: 0 },
  deviceId: { type: mongoose.Schema.Types.ObjectId, required: true }
}

const options = { timestamps: true }

const uptimeSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('Uptime', uptimeSchema)
