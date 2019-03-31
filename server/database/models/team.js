const mongoose = require('mongoose')

const definition = {
  name: { type: String, required: true },
  members: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: Number, default: 0 }, //0: pending, 1: accepted, 2: rejected
      allowHelpDesk: { type: Boolean, default: false }
    }
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}

const options = {
  timestamps: true
}

const teamSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model('Team', teamSchema)
