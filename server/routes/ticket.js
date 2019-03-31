const express = require('express')

const { ticketController } = require('../controllers')

const router = express.Router()

router.put('/:ticketId', ticketController.update)
router.delete('/:ticketId', ticketController.delete)

module.exports = router
