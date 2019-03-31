const express = require('express')
const router = express.Router()
const { windowsEventLogController } = require('../controllers')

router.post('/', windowsEventLogController.add)
router.get('/', windowsEventLogController.list)
router.put('/:id', windowsEventLogController.update)
router.delete('/:id', windowsEventLogController.remove)

module.exports = router
