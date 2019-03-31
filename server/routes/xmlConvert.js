const express = require('express')
const router = express.Router()
const { xmlConvertController } = require('../controllers')

router.post('/', xmlConvertController.convert)
router.post('/export', xmlConvertController.exportData)

module.exports = router
