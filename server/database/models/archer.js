//import mongoose, our ODM for mongoDB
const mongoose = require('mongoose')

//Define all of its fields, like columns of a SQL table
const definition = {
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dbInformation: {
    server: { type: String, default: '' },
    user: { type: String, default: '' },
    password: { type: String, default: '' }
  },
  errorLogs: [
    {
      url: { type: String, default: '' },
      name: { type: String, default: '' },
      createdAt: { type: String, default: '' },
      deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
      hashCode: { type: Number, default: -1 },
      fileName: { type: String, default: '' }
    }
  ],
  instances: [
    {
      name: { type: String, default: '' },
      database: { type: String, default: '' }
    }
  ],
  hashCode: { type: Number, default: -1 },
  helpDeskTicket: { type: Boolean, default: false }
}

//Set any options for the schema
const options = {
  timestamps: true
}

//make the schema as a new instance of a mongoose schema, using our definition and options
const archerSchema = new mongoose.Schema(definition, options)

//export that boye
module.exports = mongoose.model('Archer', archerSchema)
