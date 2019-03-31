const express = require('express')

const { dashboardController } = require('../controllers')

const router = express.Router()

router.get('/deviceOverview', dashboardController.getDeviceOverview)
router.get('/overalldata/:userId', dashboardController.getOverallData)
router.get(
  '/datafeed_history/:userId',
  dashboardController.getDatafeedStatusLast30days
)
router.get('/', dashboardController.getOverview)
router.get('/error_list/:userId', dashboardController.getErrorListLast24hours)
router.get('/iisLogs/:userId', dashboardController.getIisLogsForMapData)
router.get(
  '/servicesServerCount/:userId',
  dashboardController.servicesServerCount
)
router.get('/databaseCount/:userId', dashboardController.getDatabaseCount)
router.get('/archerCount/:userId', dashboardController.getArcherCount)
router.get('/webServerCount/:userId', dashboardController.getWebServerCount)
router.get('/percentage/:userId', dashboardController.getPercentage)
module.exports = router
