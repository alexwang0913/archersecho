const express = require('express')
const { teamController } = require('../controllers')
const router = express.Router()

router.post('/add', teamController.add)
router.post('/addMember', teamController.addMember)
router.post('/update', teamController.update)
router.post('/updateMemberStatus', teamController.updateMemberStatus)
router.post('/removeMember', teamController.removeMember)
router.post('/updateAllow', teamController.updateAllow)

router.get('/getMyTeam/:userId', teamController.getMyTeam)
router.get('/getTeamInfo/:teamId', teamController.getTeamInfo)
router.get('/getJoinTeam/:userId', teamController.getJoinTeam)
router.get('/getMembers/:userId', teamController.getMemberList)
router.get('/helpDeskMembers/:userId', teamController.getHelpDeskMembers)

router.delete('/:teamId', teamController.remove)

module.exports = router
