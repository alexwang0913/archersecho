//import mongoose, our ODM for mongoDB
const mongoose = require('mongoose')

//Define all of its fields, like columns of a SQL table
const definition = {
  machineType: { type: Number, required: true }, // 1: Cpu, 2: Memory
  compareType: { type: Number, required: false }, // 1: > , 2: <
  amount: { type: Number, required: false },
  time: { type: Number, required: false },
  recommendation: { type: String, required: false }
}

//Set any options for the schema
const options = {
  timestamps: true
}

//make the schema as a new instance of a mongoose schema, using our definition and options
const portentialSupportSchema = new mongoose.Schema(definition, options)

//export that boye
module.exports = mongoose.model('PortentialSupport', portentialSupportSchema)
