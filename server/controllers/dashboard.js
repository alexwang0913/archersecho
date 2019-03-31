const { Device, User, Archer, IisLog } = require('../database/models')
const Promise = require('bluebird')
const sql = require('mssql')
const { getFormatDate } = require('../utils')
const iplocation = require('iplocation').default
const { deviceController } = require('./index')

exports.getOverview = async (req, res) => {
  // Promise.all([
  //   Device.find({})
  //     .count()
  //     .exec()
  //     .then(count => {
  //       return count
  //     }),
  //   User.find({})
  //     .count()
  //     .exec()
  //     .then(count => {
  //       return count
  //     })
  // ]).spread((deviceCount, userCount) => {
  //   res.status(200).json({
  //     deviceCount: deviceCount,
  //     userCount: userCount
  //   })
  // })
  const users = await User.find({})
  let userIds = []
  for (const user of users) {
    userIds.push(user._id)
  }
  const archers = await Archer.find({ userId: { $in: userIds } })
  let archerIds = []
  for (const archer of archers) {
    archerIds.push(archer._id)
  }
  const deviceCount = await Device.find({
    archerId: { $in: archerIds }
  }).count()
  res.json({
    deviceCount: deviceCount,
    userCount: users.length
  })
}

exports.getDeviceOverview = async (req, res) => {
  // Promise.all([
  //   Device.find({ status: 0 })
  //     .count()
  //     .exec()
  //     .then(count => {
  //       return count
  //     }),
  //   Device.find({ status: 1 })
  //     .count()
  //     .exec()
  //     .then(count => {
  //       return count
  //     }),
  //   Device.find({ status: 3 })
  //     .count()
  //     .exec()
  //     .then(count => {
  //       return count
  //     }),
  //   Device.find({ status: 2 })
  //     .count()
  //     .exec()
  //     .then(count => {
  //       return count
  //     })
  // ]).spread((online, offline, processNotRunning, neverCommunicate) => {
  //   res.status(200).json([online, offline, processNotRunning, neverCommunicate])
  // })
  const users = await User.find({})
  let userIds = []
  for (const user of users) {
    userIds.push(user._id)
  }
  const archers = await Archer.find({ userId: { $in: userIds } })
  let archerIds = []
  for (const archer of archers) {
    archerIds.push(archer._id)
  }
  const devices = await Device.find({ archerId: { $in: archerIds } })
  let online = 0,
    offline = 0,
    processNotRunning = 0,
    neverCommunicate = 0
  for (const device of devices) {
    if (device.status === 0) {
      online += 1
    } else if (device.status === 1) {
      offline += 1
    } else if (device.status === 2) {
      processNotRunning += 1
    } else if (device.status === 3) {
      neverCommunicate += 1
    }
  }
  res.json([online, offline, processNotRunning, neverCommunicate])
}

exports.getOverallData = async (req, res) => {
  const { userId } = req.params
  const archers = await Archer.find({ userId: userId })
  let archerIds = []
  let databases = []
  let instances = []
  for (const archer of archers) {
    archerIds.push(archer._id)
    databases.push(archer.dbInformation)
    for (const instance of archer.instances) {
      instances.push(instance)
    }
  }

  // Services Server
  const servicesServerCount = await Device.find({
    archerId: { $in: archerIds },
    type: { $regex: /3/ }
  }).count()

  // Database
  let current = null
  let cnt = 0
  let dbCount = 0
  for (let i = 0; i < databases.length; i++) {
    if (databases[i] != current) {
      if (cnt > 0) {
        dbCount++
        // document.write(current + ' comes --> ' + dbCount + ' times<br>')
      }
      current = databases[i]
      cnt = 1
    } else {
      cnt++
    }
  }

  // Archer
  const archerCount = archers.length

  // Web server
  const webServerCount = await Device.find({
    archerId: { $in: archerIds },
    type: /1/
  }).count()

  // User logged in
  let dbInfoList = []

  for (const archer of archers) {
    for (const instance of archer.instances) {
      dbInfoList.push({
        server: archer.dbInformation.server,
        user: archer.dbInformation.user,
        password: archer.dbInformation.password,
        database: instance
      })
    }
  }

  Promise.map(dbInfoList, dbInfo => {
    return new sql.ConnectionPool(dbInfo)
      .connect()
      .then(pool => {
        return pool.query`SELECT COUNT(*) as loginUserCount FROM viewUserList WHERE logged_in=1`
      })
      .then(result => {
        return result.recordset[0].loginUserCount
      })
      .catch(err => {
        return 0
      })
  })
    .then(results => {
      let userLoggedInCount = 0
      for (const result of results) {
        userLoggedInCount += result
      }
      const result = {
        servicesServer: servicesServerCount,
        database: dbCount,
        archer: archerCount,
        webServer: webServerCount,
        usersLoggedIn: userLoggedInCount
      }
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getDatafeedStatusLast30days = async (req, res) => {
  const { userId } = req.params
  const archers = await Archer.find({ userId: userId })

  let dbInfoList = []

  for (const archer of archers) {
    for (const instance of archer.instances) {
      dbInfoList.push({
        server: archer.dbInformation.server,
        user: archer.dbInformation.user,
        password: archer.dbInformation.password,
        database: instance
      })
    }
  }

  // calculate the last 30days
  const now = new Date()
  const lastMonth = new Date(now.getTime() - 1000 * 3600 * 24 * 30)

  let days = []
  for (let d = lastMonth; d <= now; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  Promise.map(dbInfoList, dbInfo => {
    return new sql.ConnectionPool(dbInfo)
      .connect()
      .then(pool => {
        return pool.query`SELECT status_id, create_date FROM tblDataFeedHistory ORDER BY create_date ASC`
      })
      .then(result => {
        return result.recordset
      })
      .catch(err => {
        return null
      })
  })
    .then(results => {
      let dataFeedHistories = []
      for (const dataFeed of results) {
        if (!dataFeed) continue
        for (const history of dataFeed) {
          dataFeedHistories.push(history)
        }
      }
      // console.log(dataFeedHistories)
      let statusPerDay = []
      for (const day of days) {
        let statusList = []
        for (const dataFeedHistory of dataFeedHistories) {
          const { status_id, create_date } = dataFeedHistory
          if (
            day.getFullYear() === create_date.getFullYear() &&
            day.getMonth() === create_date.getMonth() &&
            day.getDate() === create_date.getDate()
          ) {
            statusList.push(status_id)
          }
        }

        let breakLoop = false
        let dayStatus = 0
        for (const status of statusList) {
          if (!breakLoop) {
            if (status > 4) {
              dayStatus = 5
              breakLoop = true
            } else if (status === 4) {
              dayStatus = 4
              breakLoop = true
            } else if (status === 3) {
              dayStatus = 3
              breakLoop = true
            } else if (status === 2) {
              dayStatus = 2
              breakLoop = true
            } else if (status === 1) {
              dayStatus = 1
              breakLoop = true
            }
          }
        }
        statusPerDay.push({
          day: getFormatDate(day),
          status: dayStatus
        })
      }
      res.status(200).json(statusPerDay)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getErrorListLast24hours = async (req, res) => {
  const { userId } = req.params

  // get Archers from userId
  const archers = await Archer.find({ userId: userId })

  // get whole errorlogs
  let errorLogs = []
  const now = new Date()
  for (const archer of archers) {
    for (const errorLog of archer.errorLogs) {
      // Check last 24hour
      const errorLogCreatedAt = new Date(errorLog.createdAt)
      if (errorLogCreatedAt.getTime() > now.getTime() - 1000 * 3600 * 24) {
        errorLogs.push(errorLog)
      }
    }
  }
  res.status(200).json(errorLogs)
}

exports.getIisLogsForMapData = async (req, res) => {
  const { userId } = req.params

  const archers = await Archer.find({ userId: userId })
  let archerIds = []
  for (const archer of archers) {
    archerIds.push(archer._id)
  }

  const devices = await Device.find({ archerId: { $in: archerIds } })
  let deviceIds = []
  for (const device of devices) {
    deviceIds.push(device._id)
  }

  //{ latLng: [29.4969, -98.4032], name: '10.20.30.40, 999' }
  IisLog.aggregate(
    [
      {
        $match: {
          deviceId: { $in: deviceIds }
        }
      },
      {
        $group: {
          _id: '$userIpAddress',
          loadTime: { $sum: '$loadTime' }
        }
      }
    ],
    (err, result) => {
      Promise.map(result, data => {
        return iplocation(data._id)
          .then(res => {
            return {
              latLng: [res.latitude, res.longitude],
              name: `IpAddress: ${res.ip}, LoadTime: ${data.loadTime}`
            }
          })
          .catch(err => {
            return null
          })
      })
        .then(result => {
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(500).json(err)
        })
    }
  )
}

exports.servicesServerCount = async (req, res) => {
  const { userId } = req.params
  // Get ArcherIds
  const archers = await Archer.find({ userId: userId })
  let archerIds = []
  for (const archer of archers) {
    archerIds.push(archer._id)
  }

  Device.find({
    archerId: { $in: archerIds },
    type: { $regex: /3/ }
  })
    .count()
    .then(count => {
      res.json(count)
    })
    .catch(err => {
      res.json(err).status(500)
    })
}

exports.getDatabaseCount = async (req, res) => {
  const { userId } = req.params
  const archers = await Archer.find({ userId: userId })
  let dbList = []
  for (const archer of archers) {
    dbList.push(archer.dbInformation)
  }
  let current = null
  let cnt = 0
  let dbCount = 0
  for (let i = 0; i < dbList.length; i++) {
    if (dbList[i] != current) {
      if (cnt > 0) {
        dbCount++
        // document.write(current + ' comes --> ' + dbCount + ' times<br>')
      }
      current = dbList[i]
      cnt = 1
    } else {
      cnt++
    }
  }
  res.json(dbCount)
}

exports.getArcherCount = async (req, res) => {
  const { userId } = req.params
  const archerCount = await Archer.find({ userId: userId }).count()
  res.json(archerCount)
}

exports.getWebServerCount = async (req, res) => {
  const { userId } = req.params
  const archers = await Archer.find({ userId: userId })
  let archerIds = []
  for (const archer of archers) {
    archerIds.push(archer._id)
  }
  const webServerCount = await Device.find({
    archerId: { $in: archerIds },
    type: /1/
  }).count()
  res.json(webServerCount)
}

exports.getPercentage = (req, res) => {
  // const { userId } = req.params
  // const archers = await Archer.find({userId: userId})
  // Promise.map(archers, archer => {
  //   deviceController.getDbDeviceByArcher(archer._id, (err, deviceInfo) => {
  //   })
  // })
  // const {instances} = await Archer.find({userId: userId})
  // const dbInfo = {
  //   server: '157.56.176.16',
  //   user: 'Archer',
  //   password: 'Password12345!',
  //   database: 'instance1'
  // }
  // new sql.ConnectionPool(dbInfo)
  //   .connect()
  //   .then(pool => {
  //     return pool.query`
  //       USE instance1;
  // SELECT module_id, STRING_AGG(field_id, ',') AS field_ids, STRING_AGG(field_type_id, ',') AS field_type_ids
  // FROM viewApplicationFieldList
  // group by module_id
  // order by module_id ASC
  //     `
  //     // return pool.query`
  //     //   USE instance1;
  //     //   SELECT module_id, field_id, field_type_id
  //     //   FROM viewApplicationFieldList
  //     //   ORDER BY module_id ASC
  //     // `
  //   })
  //   .then(result => {
  //     // console.log(result)
  //     res.json(result)
  //   })
  //   .catch(err => {
  //     res.json(err).status(500)
  //   })
}
