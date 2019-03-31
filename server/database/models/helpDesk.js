const mongoose = require('mongoose')

const definition = {
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  openDate: { type: Date, default: null },
  closeDate: { type: Date, default: null },
  status: { type: Number, default: 0 },
  note: { type: String, default: '' },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}

const options = {
  timestamps: true
}

const helpDeskSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('HelpDesk', helpDeskSchema)
