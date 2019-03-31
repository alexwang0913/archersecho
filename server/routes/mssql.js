const express = require('express')

const { msSqlController } = require('../controllers')

const router = express.Router()

router.get('/', msSqlController.list)

module.exports = router
