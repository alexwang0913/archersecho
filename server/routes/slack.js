const express = require('express')

const { slackController } = require('../controllers')

const router = express.Router()

router.post('/send', slackController.send)

module.exports = router
