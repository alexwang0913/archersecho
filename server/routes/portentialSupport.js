//Here is where we declare the modules and shit we will need
const express = require('express')

//import the controllers and middleware
const { portentialSupportController } = require('../controllers/index')

//set up the router
const router = express.Router()

router.post('/', portentialSupportController.add)

router.get('/', portentialSupportController.list)

router.put('/:id', portentialSupportController.update)

router.delete('/:id', portentialSupportController.delete)

module.exports = router
