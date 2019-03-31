const mongoose = require('mongoose')

const definition = {
  ipAddress: { type: String, default: '', required: true },
  attemptCount: { type: Number, default: 0 },
  isLogin: { type: Boolean, default: false },
  isPanelty: { type: Boolean, default: false },
  paneltyTime: { type: Date, default: null },
  loginTime: { type: Date, default: null },
  usereId: { type: String, default: '' }
}

const options = {
  timestamps: true
}

const tempLoginSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('TempLogin', tempLoginSchema)
