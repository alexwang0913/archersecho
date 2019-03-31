const mongoose = require('mongoose')

const definition = {
  userName: { type: String, required: true },
  password: { type: String, required: true },
  isLogin: { type: Boolean, default: false },
  archerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Archer' },
  isActive: { type: Boolean, default: true },
  instance: { type: String, default: '' },
  mail: { type: String, default: '' }
}

const options = {
  timestamps: true
}

const supportTicketSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('SupportTicket', supportTicketSchema)
