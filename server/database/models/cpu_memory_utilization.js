const mongoose = require('mongoose')

const definition = {
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  cpuUsage: { type: Number, default: 0 },
  memoryAvailable: { type: Number, default: 0 }
}

const options = {
  timestamps: true
}

const cpuMemoryUtilizationSchema = new mongoose.Schema(definition, options)

module.exports = mongoose.model(
  'CpuMemoryUtilization',
  cpuMemoryUtilizationSchema
)
