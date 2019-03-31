const mongoose = require('mongoose')

const definition = {
  deviceId: { type: mongoose.Types.ObjectId, ref: 'Device' },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  archerIpAddress: { type: String, default: '' },
  method: { type: String, default: '' },
  page: { type: String, default: '' },
  port: { type: Number, default: -1 },
  userIpAddress: { type: String, default: '' },
  statusCode: { type: Number, default: -1 },
  loadTime: { type: Number, default: -1 }
}

const options = {
  timestamps: true
}

const iisLogShema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('IisLog', iisLogShema)
