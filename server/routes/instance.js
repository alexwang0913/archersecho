const express = require('express')

const { instanceController } = require('../controllers')

const router = express.Router()

router.get('/', instanceController.list)

router.post('/dataFeedHistory', instanceController.getDataFeedHistory)
router.post('/dataFeeds', instanceController.getDataFeeds)
router.post('/getInformation', instanceController.getInformation)
router.post('/getApplicationFields', instanceController.getApplicationFields)
router.post(
  '/getApplicationFieldsBySearch',
  instanceController.getApplicationFieldsBySearch
)
router.post('/getCalculatedFields', instanceController.getCalculatedFields)
router.post('/', instanceController.add)

router.put('/:id', instanceController.update)

router.delete('/:id', instanceController.delete)

module.exports = router
