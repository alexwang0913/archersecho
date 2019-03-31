//import mongoose, our ODM for mongoDB
const mongoose = require('mongoose')

//Define all of its fields, like columns of a SQL table
const definition = {
  name: { type: String, required: true },
  cpu: {
    Usage: { type: Number, default: 0 },
    ProcessCount: { type: Number, default: 0 },
    Uptime: { type: Number, default: 0 }
  },
  memory: {
    Usage: { type: Number, default: 0 },
    Available: { type: Number, default: 0 }
  },
  network: [
    {
      Name: { type: String, default: '' },
      Send: { type: Number, default: 0 },
      Receive: { type: Number, default: 0 }
    }
  ],
  process: [
    {
      Name: { type: String, required: true },
      Status: { type: Boolean, default: false },
      isActive: { type: Boolean, default: false },
      updateAt: { type: Date, default: null }
    }
  ],
  updateTime: { type: Date, default: null }, // Update when data is commit from client
  status: { type: Number, default: 2 }, // 0: Online, 1: Offline, 2: Black(never communicate with webServer), 3: Yellow(processes are offline even device is online)
  type: { type: String, default: '' }, //1: WebServer, 2: Services Server, 3: Database Server, 4: Other
  supportTime: { type: Date, default: new Date() }, //  Calculate diffrence times for portential support
  supportMessage: { type: String, default: '' }, // Message from portentialSupport
  drives: [
    {
      Available: { type: String, required: false },
      Label: { type: String, required: false },
      Total: { type: Number, required: false },
      Used: { type: Number, required: false }
    }
  ],
  errorList: [
    {
      Correlation: { type: String, required: false },
      EventID: { type: String, required: false },
      Execution: { type: String, required: false },
      Level: { type: String, required: false },
      Source: { type: String, required: false },
      SubType: { type: String, required: false },
      TimeCreated: { type: Date, required: false },
      Type: { type: String, required: false }
    }
  ],
  mssql: {
    user: { type: String, required: false, default: '' },
    password: { type: String, required: false, default: '' },
    server: { type: String, required: false, default: '' },
    database: { type: String, required: false, default: 'Configuration' }
  },
  errorLog: [
    // Error log files info
    {
      fileName: { type: String, required: false },
      timeCreated: { type: Date, default: null, required: false },
      timeUpdated: { type: Date, required: false, default: null }
    }
  ],
  archerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  eventLogs: [
    {
      EventID: { type: String, default: '' },
      TimeGenerated: { type: String, default: '' }
    }
  ],
  iisLogs: {
    fileName: { type: String, default: '' },
    hashCode: { type: String, default: '' },
    url: { type: String, default: '' }
  },
  socketId: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  },
  publicDeviceId: {
    type: String,
    default: ''
  }
}

//Set any options for the schema
const options = {
  timestamps: true
}

//make the schema as a new instance of a mongoose schema, using our definition and options
const deviceSchema = new mongoose.Schema(definition, options)

//export that boye
module.exports = mongoose.model('Device', deviceSchema)
