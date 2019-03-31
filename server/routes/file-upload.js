const express = require('express')

const { uploadController } = require('../controllers')

const router = express.Router()

router.post('/', uploadController.add)

router.get('/', uploadController.list)

router.delete('/:id', uploadController.delete)

module.exports = router
