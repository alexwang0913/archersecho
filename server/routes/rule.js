const express = require('express')

const { ruleController } = require('../controllers')

const router = express.Router()

router.post('/', ruleController.add)

router.get('/', ruleController.list)

router.put('/:id', ruleController.update)

router.delete('/:id', ruleController.delete)

module.exports = router
