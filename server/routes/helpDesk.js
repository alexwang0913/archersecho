const express = require('express')
const router = express.Router()
const { helpDeskController } = require('../controllers')

router.post('/', helpDeskController.addTicket)
router.post('/updateStatus', helpDeskController.updateStatus)
router.post('/saveNote', helpDeskController.saveNote)
router.post('/close', helpDeskController.close)

router.get('/all', helpDeskController.getAllList)
router.get('/validateUser/:userId', helpDeskController.validateUser)
router.get('/myTickets/:userId', helpDeskController.getMyTickets)
router.get('/requestTickets/:userId', helpDeskController.getRequestTickets)
router.get('/:id', helpDeskController.getInfo)

router.put('/:id', helpDeskController.update)

router.delete('/:id', helpDeskController.deleteTicket)

module.exports = router
