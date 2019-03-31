//import mongoose, our ODM for mongoDB
const mongoose = require('mongoose')

//Define all of its fields, like columns of a SQL table
const definition = {
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }],
  notificationDuration: { type: Number, default: 20 },
  companyName: { type: String, default: '', required: false },
  profileUrl: {
    type: String,
    default: 'https://s3.us-east-2.amazonaws.com/archeresecho/default.png',
    required: false
  },
  activatedAt: { type: Date, default: null },
  passwordUpdatedAt: { type: Date, default: Date.now },
  socketId: { type: String, default: '' },
  ipAddress: { type: String, default: '' }
}

//Set any options for the schema
const options = { timestamps: true }

//make the schema as a new instance of a mongoose schema, using our definition and options
const userSchema = new mongoose.Schema(definition, options)

//export that boye
module.exports = mongoose.model('User', userSchema)
