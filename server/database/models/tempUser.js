const mongoose = require('mongoose')

const definition = {
  userName: { type: String, required: true },
  password: { type: String, required: true },
  isLogin: { type: Boolean, default: false },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  isActive: { type: Boolean, default: true }
}

const options = { timestamps: true }

const tempUserSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('TempUser', tempUserSchema)
