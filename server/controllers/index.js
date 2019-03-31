//Here we will import all our controllers, this way we only need to
//import the controller as a single module, or an explicit constant later!!!
const usersController = require('./users')
const authController = require('./auth')
const deviceController = require('./device')
const portentialSupportController = require('./portentialSupport')
const msSqlController = require('./mssql')
const uploadController = require('./upload')
const dashboardController = require('./dashboard')
const ticketController = require('./supportTicket')
const instanceController = require('./instance')
const cpuMemoryUtilizationController = require('./cpuMemoryUtilization')
const archerController = require('./archer')
const ruleController = require('./rule')
const uptimeController = require('./uptime')
const slackController = require('./slack')
const teamController = require('./team')
const windowsEventLogController = require('./windowsEventLog')
const xmlConvertController = require('./xmlConvert')
const supportTicketController = require('./supportTicket')
const enrollmentController = require('./enrollment')
const helpDeskController = require('./helpDesk')

module.exports = {
  usersController,
  authController,
  deviceController,
  portentialSupportController,
  msSqlController,
  uploadController,
  dashboardController,
  ticketController,
  instanceController,
  cpuMemoryUtilizationController,
  archerController,
  ruleController,
  uptimeController,
  slackController,
  teamController,
  windowsEventLogController,
  xmlConvertController,
  supportTicketController,
  enrollmentController,
  helpDeskController
}
