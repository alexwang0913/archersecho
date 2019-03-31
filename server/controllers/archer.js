const {
  Archer,
  Device,
  Uptime,
  CpuMemoryUtilization,
  SupportTicket,
  Team
} = require('../database/models')
const { deviceController } = require('./index')
const Promise = require('bluebird')
const { timeFromSecond } = require('../utils')
const sql = require('mssql')
const randomstring = require('randomstring')
const mongoose = require('mongoose')

exports.add = (req, res) => {
  new Archer(req.body)
    .save()
    .then(archer => {
      res.status(200).json(archer)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.list = async (req, res) => {
  const { userId } = req.params
  // Get team member's id
  let userIds = [userId]

  const myTeam = await Team.findOne({ owner: userId })
  if (myTeam) {
    myTeam.members.forEach(member => {
      if (member.status === 1) {
        userIds.push(member.id)
      }
    })
  }

  const joinTeams = await Team.find({ 'members.id': userId })
  if (joinTeams) {
    joinTeams.forEach(joinTeam => {
      if (joinTeam) {
        userIds.push(joinTeam.owner)
        joinTeam.members.forEach(member => {
          if (member.status === 1 && member.id != userId) {
            userIds.push(member.id)
          }
        })
      }
    })
  }

  Archer.find({
    userId: {
      $in: userIds
    }
  })
    .then(archers => {
      res.status(200).json(archers)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.addInstance = (req, res) => {
  Archer.updateOne(
    { _id: req.body.archerId },
    {
      $push: {
        instances: {
          name: req.body.name,
          database: req.body.database
        }
      }
    }
  )
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getDatabaseInformation = (req, res) => {
  Archer.findById(req.params.archerId)
    .then(archer => {
      res.status(200).json(archer.dbInformation)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.updateDatabaseInformation = (req, res) => {
  Archer.updateOne(
    { _id: req.params.archerId },
    { $set: { dbInformation: req.body } }
  )
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getErrorLogs = (req, res) => {
  // Device.find({ archerId: req.params.archerId })
  //   .then(devices => {
  //     let errorLogs = []
  //     for (const device of devices) {
  //       for (const errorLog of device.errorLog) {
  //         errorLogs.push(errorLog)
  //       }
  //     }
  //     res.status(200).json(errorLogs)
  //   })
  //   .catch(err => {
  //     res.status(500).json(err)
  //   })
  Archer.findById(req.params.archerId)
    .then(archer => {
      res.status(200).json(archer.errorLogs)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getInstances = (req, res) => {
  Archer.findById(req.params.archerId)
    .then(archer => {
      res.status(200).json(archer.instances)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getAverageData = async (req, res) => {
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)
  const userId = req.body.userId

  const archers = await Archer.find({ userId: userId })
  Promise.map(archers, archer => {
    return Device.find({ archerId: archer._id })
      .then(devices => {
        let deviceIds = []
        for (const device of devices) {
          deviceIds.push(device._id)
        }
        const deviceCount = devices.length
        if (deviceCount < 1) {
          return {
            archer: archer.name,
            uptime: '-',
            cpu: '-',
            memory: '-'
          }
        }
        return Promise.all([
          Uptime.find({
            deviceId: { $in: deviceIds },
            createdAt: { $gte: startDate, $lte: endDate }
          }).then(uptimes => {
            let totalSeconds = 0
            for (const uptime of uptimes) {
              totalSeconds += uptime.onlineSeconds
            }
            const avgSeconds = Math.floor(totalSeconds / deviceCount)
            return timeFromSecond(avgSeconds)
          }),
          new Promise((resolve, reject) => {
            return CpuMemoryUtilization.aggregate(
              [
                {
                  $group: {
                    _id: '$deviceId',
                    cpuAvg: { $avg: '$cpuUsage' },
                    memoryAvg: { $avg: '$memoryAvailable' }
                  }
                },
                {
                  $match: { _id: { $in: deviceIds } }
                }
              ],
              (err, utilizations) => {
                if (err) {
                  return err
                }
                let totalCpuUsage = 0
                let totalMemoryAvailable = 0
                for (const util of utilizations) {
                  totalCpuUsage += util.cpuAvg
                  totalMemoryAvailable += util.memoryAvg
                }
                const avgCpu = Math.floor(totalCpuUsage / deviceCount)
                const avgMemory = Math.floor(totalMemoryAvailable / deviceCount)
                return resolve({
                  cpu: avgCpu,
                  memory: avgMemory
                })
              }
            )
          })
        ]).spread((avgUptime, avgCpuMemory) => {
          return {
            archer: archer.name,
            uptime: avgUptime,
            cpu: avgCpuMemory.cpu,
            memory: avgCpuMemory.memory
          }
        })
      })
      .catch(err => {
        return err
      })
  })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.generateSupportTicket = async (data, cb) => {
  const { archerId, instance } = data

  // deviceController.getDbDeviceByArcher(archerId, )

  new SupportTicket({
    userName: randomstring.generate(4),
    password: randomstring.generate(8),
    archerId: archerId,
    instance: instance
  })
    .save()
    .then(supportTicket => {
      const ticketInfo = {
        tempUserName: supportTicket.userName,
        tempPassword: supportTicket.password,
        id: supportTicket._id
      }
      // res.status(200).json(ticketInfo)
      cb(ticketInfo)
    })
}

exports.getDbConfiguration = async (req, res) => {
  const { archerId } = req.params
  const { dbInformation } = await Archer.findById(archerId)
  dbInformation['database'] = 'Configuration'

  new sql.ConnectionPool(dbInformation)
    .connect()
    .then(pool => {
      return pool.query`
        SELECT TOP(1) application_version
        FROM tblConfigApplication
        ORDER BY create_date ASC
      `
    })
    .then(configApplication => {
      res.status(200).json(configApplication.recordset[0])
    })
    .catch(err => {
      res.status(200).json(null)
    })
}

exports.getSupportTickets = async (req, res) => {
  const { archerId } = req.params
  SupportTicket.find({ archerId: archerId })
    .then(tickets => {
      res.status(200).json(tickets)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getArcherInfo = async (req, res) => {
  Archer.find({ _id: req.params.archerId })
    .then(archers => {
      res.status(200).json(archers)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.updateArcher = (req, res) => {
  const { id } = req.body
  Archer.update({ _id: id }, { $set: req.body })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.delete = (req, res) => {
  const { id } = req.params
  Archer.remove({ _id: id })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  // Remove SupportTickets in Archer
  SupportTicket.remove({ archerId: id })
    .then(result => {})
    .catch(err => {
      console.log('Error from Remove SupportTicket')
      console.log(err)
    })
}

exports.removeInstance = (req, res) => {
  const { archerId, instance } = req.body
  Archer.update({ _id: archerId }, { $pull: { instances: instance } })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.addError = async (data, cb) => {
  const { deviceId, url, name, hashCode, fileName } = data
  const { archerId } = await Device.findById(deviceId)
  const archer = await Archer.findById(archerId)

  // Remove existing errorLogs
  Archer.update({ _id: archerId }, { $pull: { errorLogs: { name: name } } })
    .then(result => {
      /**
       * Verify errorLogs in the archer
       * There will be errorLogs last 5days and only 10 errors
       */
      const now = new Date()
      const fiveDaysAgo = new Date(now.getTime() - 1000 * 3600 * 24 * 5)

      Archer.update(
        { _id: archerId },
        { $pull: { errorLogs: { createdAt: { $lte: fiveDaysAgo } } } }
      ).then(result => {
        if (archer.errorLogs.length > 9) {
          const cnt = archer.errorLogs.length - 9
          let errorLogIds = []
          for (let i = 0; i < cnt; i++) {
            errorLogIds.push(archer.errorLogs[i]._id)
          }
          Archer.update(
            { _id: archerId },
            { $pull: { errorLogs: { _id: { $in: errorLogIds } } } }
          ).then(result => {
            Archer.update(
              { _id: archerId },
              {
                $push: {
                  errorLogs: {
                    url: url,
                    name: name,
                    deviceId: deviceId,
                    hashCode: hashCode,
                    fileName: fileName
                  }
                }
              }
            )
              .then(result => {
                cb(null, result)
              })
              .catch(err => {
                cb(err, null)
              })
          })
        } else {
          Archer.update(
            { _id: archerId },
            {
              $push: {
                errorLogs: {
                  url: url,
                  name: name,
                  deviceId: deviceId,
                  hashCode: hashCode,
                  fileName: fileName
                }
              }
            }
          )
            .then(result => {
              cb(null, result)
            })
            .catch(err => {
              cb(err, null)
            })
        }
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getErrorLogByDeviceId = async (req, res) => {
  const { deviceId } = req.params

  Archer.aggregate(
    [
      { $unwind: { path: '$errorLogs' } },
      { $match: { 'errorLogs.deviceId': mongoose.Types.ObjectId(deviceId) } },
      { $project: { 'errorLogs.fileName': 1, 'errorLogs.hashCode': 1 } }
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err)
      }
      let errorLogs = []
      for (const data of result) {
        errorLogs.push(data.errorLogs)
      }
      res.status(200).json(errorLogs)
    }
  )
}

exports.addHelpDeskTicket = (req, res) => {
  Archer.updateMany({ _id: { $in: req.body } }, { helpDeskTicket: true })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getNoHelpDeskList = (req, res) => {
  Archer.find({ helpDeskTicket: { $ne: true } }, { name: 1, userId: 1 })
    .populate('userId', 'userId')
    .then(archers => {
      const result = archers.filter(archer => {
        return archer.userId !== null
      })
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getHelpDeskList = (req, res) => {
  Archer.find({ helpDeskTicket: true }, { name: 1, userId: 1 })
    .populate('userId', 'userId')
    .then(archers => {
      const result = archers.filter(archer => {
        return archer.userId !== null
      })
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.unallowHelpDesk = (req, res) => {
  Archer.updateOne({ _id: req.params.id }, { helpDeskTicket: false })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
