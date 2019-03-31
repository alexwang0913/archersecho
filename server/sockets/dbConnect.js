const { deviceController, usersController } = require('../controllers')
const global = require('./global')
const { getFormatDate } = require('../utils')

exports.responseFromStatusRepoter = (io, socket, data) => {
  console.log('DB Connector')
  console.log('response from :' + data.method)

  if (data.method === 'login') {
    const { deviceId, publicDeviceId } = data
    const ip = socket.handshake.address
    console.log('Device Id: ' + deviceId)
    deviceController.deviceLogin(deviceId, (err, deviceInfo) => {
      if (err) {
        console.log('Error from DeviceLogin')
        console.log(err)
        const data = { status: 500, err: err, deviceId: deviceId }
        socket.emit('RESPONSE', data)
      }
      if (!deviceInfo) {
        console.log('No device error')
        const data = { status: 500, err: 'No deviceId', deviceId: deviceId }
        socket.emit('RESPONSE', data)
      } else {
        console.log(deviceInfo)
        const data = {
          deviceId: deviceId,
          socketId: socket.id,
          ipAddress: ip,
          publicDeviceId: publicDeviceId
        }
        console.log('Before update socketInfo')
        deviceController.updateSocketInfo(data, err => {
          let result = {}
          if (err) {
            console.log('Update socket error')
            console.log(err)
            result = { status: 500, err: err, deviceId: deviceId }
          } else {
            result = { status: 200, data: deviceInfo, deviceId: deviceId }
          }
          console.log(result)

          socket.emit('RESPONSE', result)
        })
      }
    })
  } else if (data.method === 'GET_USER_LOGIN_COUNT') {
    global.GET_USER_LOGIN_COUNT_DEVICE_INDEX += 1
    try {
      const result = JSON.parse(data.result)

      for (const count of result) {
        global.USER_LOGIN_COUNT += count.loginUserCount
      }
    } catch (err) {
      global.USER_LOGIN_COUNT += 0
    }
    if (
      global.GET_USER_LOGIN_COUNT_DEVICE_INDEX ===
      global.GET_USER_LOGIN_COUNT_DEVICE_COUNT
    ) {
      usersController.getSocketIdById(data.userId, (err, userInfo) => {
        if (err) {
          console.log(err)
        } else {
          console.log('Send User to:' + userInfo.socketId)
          io.to(userInfo.socketId).emit(
            'RES_GET_USER_LOGIN_COUNT',
            global.USER_LOGIN_COUNT
          )
        }
      })
    }
  } else if (data.method === 'DATAFEED_HIHSTORY') {
    // console.log(data)
    global.DATAFEED_HISTORY_INDEX += 1
    try {
      const result = JSON.parse(data.result)
      for (const data of result) {
        global.DATAFEED_HISTORY.push(data)
      }
    } catch (err) {
      console.log(err)
      console.log(data.result)
    }
    if (global.DATAFEED_HISTORY_INDEX === global.DATAFEED_HISTORY_COUNT) {
      usersController.getSocketIdById(data.userId, (err, userInfo) => {
        if (err) {
          console.log(err)
        } else {
          const now = new Date()
          const lastMonth = new Date(now.getTime() - 1000 * 3600 * 24 * 30)

          let days = []
          for (let d = lastMonth; d <= now; d.setDate(d.getDate() + 1)) {
            days.push(new Date(d))
          }

          let statusPerDay = []
          for (const day of days) {
            let statusList = []
            for (const dataFeedHistory of global.DATAFEED_HISTORY) {
              const { status_id, create_date } = dataFeedHistory
              const cDate = new Date(create_date)
              if (
                day.getFullYear() === cDate.getFullYear() &&
                day.getMonth() === cDate.getMonth() &&
                day.getDate() === cDate.getDate()
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
          console.log('RES_DATAFEED_HISTORY user to: ' + userInfo.socketId)
          io.to(userInfo.socketId).emit('RES_DATAFEED_HISTORY', statusPerDay)
        }
      })
    }
  } else if (data.method === 'DB_CONFIGURATION') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_DB_CONFIGURATION user to:' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_DB_CONFIGURATION', result)
    })
  } else if (data.method === 'DATA_FEED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_DATA_FEED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_DATA_FEED', result)
    })
  } else if (data.method === 'INSTANCE_INFORMATION') {
    global.INSTANCE_INFORMATION_INDEX += 1
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      result = []
    }
    global.INSTANCE_INFORMATION.push({
      field: global.INSTANCE_DATA_PONITS[global.INSTANCE_INFORMATION_INDEX - 1],
      record: result
    })
    if (
      global.INSTANCE_INFORMATION_INDEX === global.INSTANCE_DATA_PONITS.length
    ) {
      usersController.getSocketIdById(data.userId, (err, userInfo) => {
        console.log('RES_INSTANCE_INFORMATION user to: ' + userInfo.socketId)
        console.log('instance information: ' + global.INSTANCE_INFORMATION)
        io.to(userInfo.socketId).emit(
          'RES_INSTANCE_INFORMATION',
          global.INSTANCE_INFORMATION
        )
      })
    }
  } else if (data.method === 'APPLICATION_FIELD') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log(err)
      result = []
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_APPLICATION_FIELD user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_APPLICATION_FIELD', result)
    })
  } else if (data.method === 'APPLICATION_FIELD_COUNT') {
    let result = 0
    try {
      result = JSON.parse(data.result)[0].totalCount
    } catch (err) {
      console.log(err)
      result = 0
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_APPLICATION_FIELD_COUNT user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_APPLICATION_FIELD_COUNT', result)
    })
  } else if (data.method === 'DATAFEED_STATISTIC') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log(err)
    }
    const statistic = {
      Running: 0,
      Completed: 0,
      Faulted: 0,
      Warning: 0,
      Terminating: 0,
      Terminated: 0,
      Pending: 0
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      for (const datafeed of result) {
        switch (datafeed.status_id) {
          case 1:
            statistic['Running']++
            break
          case 2:
            statistic['Completed']++
            break
          case 3:
            statistic['Faulted']++
            break
          case 4:
            statistic['Warning']++
            break
          case 5:
            statistic['Terminating']++
            break
          case 6:
            statistic['Terminated']++
            break
          case 7:
            statistic['Pending']++
        }
      }
      console.log('RES_DATAFEED_STATISTIC user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_DATAFEED_STATISTIC', statistic)
    })
  } else if (data.method === 'CALCULATED_FIELD') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CALCULATED_FIELD user to:' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CALCULATED_FIELD', result)
    })
  } else if (data.method === 'CALCULATED_FIELD_COUNT') {
    let result = 0
    try {
      result = JSON.parse(data.result)[0].count
    } catch (err) {
      console.log(err)
      result = 0
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CALCULATED_FIELD_COUNT user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CALCULATED_FIELD_COUNT', result)
    })
  } else if (data.method === 'INSTANCE_LOGIN_HEATMAP') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from INSTANCE_LOGIN_HEATMAP')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_INSTANCE_LOGIN_HEATMAP user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_INSTANCE_LOGIN_HEATMAP', result)
    })
  } else if (data.method === 'INSTANCE_NOTIFICATION_DETAIL') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from INSTANCE_NOTIFICATION_DETAIL')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log(
        'RES_INSTANCE_NOTIFICATION_DETAIL user to: ' + userInfo.socketId
      )
      io.to(userInfo.socketId).emit('RES_INSTANCE_NOTIFICATION_DETAIL', result)
    })
  } else if (data.method === 'ARCHER_CONFIG_REPORT') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from ARCHER_CONFIG_REPORT')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_ACR user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_ACR', result)
    })
  } else if (data.method === 'CONFIG_DATA') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from CONFIG_DATA')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CONFIG_DATA user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CONFIG_DATA', result)
    })
  } else if (data.method === 'INSTALLATION_HISTORY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from INSTALLATION_HISTORY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_INSTALLATION_HISTORY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_INSTALLATION_HISTORY', result)
    })
  } else if (data.method === 'INSTANCE_SUMMARY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from INSTANCE_SUMMARY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_INSTANCE_SUMMARY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_INSTANCE_SUMMARY', result)
    })
  } else if (data.method === 'FILE_REPOSITORY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from FILE_REPOSITORY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_FILE_REPOSITORY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_FILE_REPOSITORY', result)
    })
  } else if (data.method === 'APPLICATIONS') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from APPLICATIONS')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_APPLICATIONS user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_APPLICATIONS', result)
    })
  } else if (data.method === 'SOLUTIONS') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from SOLUTIONS')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_SOLUTIONS user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_SOLUTIONS', result)
    })
  } else if (data.method === 'VALUES_LIST') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from VALUES_LIST')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_VALUES_LIST user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_VALUES_LIST', result)
    })
  } else if (data.method === 'TOP_FIELDS') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from TOP_FIELDS')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_TOP_FIELD user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_TOP_FIELD', result)
    })
  } else if (data.method === 'ACR_DATA_FEED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from ACR_DATA_FEED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_ACR_DATA_FEED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_ACR_DATA_FEED', result)
    })
  } else if (data.method === 'USER_GROUPS_ROLES') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from USER_GROUPS_ROLES')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_USER_GROUPS_ROLES user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_USER_GROUPS_ROLES', result)
    })
  } else if (data.method === 'LOGIN_HISTORY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from LOGIN_HISTORY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_LOGIN_HISTORY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_LOGIN_HISTORY', result)
    })
  } else if (data.method === 'CURRENT_USER_PEAK') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from CURRENT_USER_PEAK')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CURRENT_USER_PEAK user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CURRENT_USER_PEAK', result)
    })
  } else if (data.method === 'JOBS_COMPLETED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from JOBS_COMPLETED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_JOBS_COMPLETED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_JOBS_COMPLETED', result)
    })
  } else if (data.method === 'JOB_QUEUED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from JOB_QUEUED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_JOB_QUEUED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_JOB_QUEUED', result)
    })
  } else if (data.method === 'JOB_ENGINE') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from JOB_ENGINE')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_JOB_ENGINE user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_JOB_ENGINE', result)
    })
  } else if (data.method === 'INSTANCE_DB') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from INSTANCE_DB')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_INSTANCE_DB user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_INSTANCE_DB', result)
    })
  } else if (data.method === 'TABES_BY_ROW') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from TABES_BY_ROW')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_TABES_BY_ROW user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_TABES_BY_ROW', result)
    })
  } else if (data.method === 'DB_TABLES') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from DB_TABLES')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_DB_TABLES user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_DB_TABLES', result)
    })
  } else if (data.method === 'TABLES_BY_SIZE') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from TABLES_BY_SIZE')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_TABLES_BY_SIZE user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_TABLES_BY_SIZE', result)
    })
  } else if (data.method === 'INSTALLATION_RESPORT') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from INSTALLATION_RESPORT')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_INSTALLATION_RESPORT user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_INSTALLATION_RESPORT', result)
    })
  } else if (data.method === 'WINDOWS') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from WINDOWS')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_WINDOWS user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_WINDOWS', result)
    })
  } else if (data.method === 'WINDOWS_SERVICE') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from WINDOWS_SERVICE')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_WINDOWS_SERVICE user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_WINDOWS_SERVICE', result)
    })
  } else if (data.method === 'SQL_SERVER') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from SQL_SERVER')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_SQL_SERVER user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_SQL_SERVER', result)
    })
  } else if (data.method === 'RUNNING_JOB_DETAIL') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from RUNNING_JOB_DETAIL')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_RUNNING_JOB_DETAIL user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_RUNNING_JOB_DETAIL', result)
    })
  } else if (data.method === 'RUNNING_JOB_SUMMARY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from RUNNING_JOB_SUMMARY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RUNNING_JOB_SUMMARY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_RUNNING_JOB_SUMMARY', result)
    })
  } else if (data.method === 'AVAILABLE_JOB_SUMMARY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from AVAILABLE_JOB_SUMMARY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_AVAILABLE_JOB_SUMMARY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_AVAILABLE_JOB_SUMMARY', result)
    })
  } else if (data.method === 'ALL_JOB_SUMMARY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from ALL_JOB_SUMMARY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_ALL_JOB_SUMMARY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_ALL_JOB_SUMMARY', result)
    })
  } else if (data.method === 'JOB_COMPLETED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from JOB_COMPLETED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_JOB_COMPLETED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_JOB_COMPLETED', result)
    })
  } else if (data.method === 'JOB_FAILED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from JOB_FAILED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_JOB_FAILED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_JOB_FAILED', result)
    })
  } else if (data.method === 'SEARCH_INDEX') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from SEARCH_INDEX')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_SEARCH_INDEX user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_SEARCH_INDEX', result)
    })
  } else if (data.method === 'CONTENT_CREATED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from CONTENT_CREATED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CONTENT_CREATED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CONTENT_CREATED', result)
    })
  } else if (data.method === 'CONTENT_UPDATED') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from CONTENT_UPDATED')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CONTENT_UPDATED user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CONTENT_UPDATED', result)
    })
  } else if (data.method === 'LDAP_ERROR_SUMMARY') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from LDAP_ERROR_SUMMARY')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_LDAP_ERROR_SUMMARY user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_LDAP_ERROR_SUMMARY', result)
    })
  } else if (data.method === 'CALCULATED_FIELD_ERROR') {
    let result = []
    try {
      result = JSON.parse(data.result)
    } catch (err) {
      console.log('Error from CALCULATED_FIELD_ERROR')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_CALCULATED_FIELD_ERROR user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_CALCULATED_FIELD_ERROR', result)
    })
  } else if (data.method === 'SUPPORT_TICKET_PRODUCTION') {
    let result = null
    try {
      result = JSON.parse(data.result)[0].data_point_value
    } catch (err) {
      console.log('Error from SUPPORT_TICKET_PRODUCTION')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_SUPPORT_TICKET_PRODUCTION user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_SUPPORT_TICKET_PRODUCTION', result)
    })
  } else if (data.method === 'SUPPORT_TICKET_VERSION') {
    let result = null
    try {
      result = JSON.parse(data.result)[0].data_point_value
    } catch (err) {
      console.log('Error from SUPPORT_TICKET_VERSION')
      console.log(err)
    }
    usersController.getSocketIdById(data.userId, (err, userInfo) => {
      console.log('RES_SUPPORT_TICKET_VERSION user to: ' + userInfo.socketId)
      io.to(userInfo.socketId).emit('RES_SUPPORT_TICKET_VERSION', result)
    })
  } else if (data.method === 'APPLICATION_FIELD_LIST_BY_MODULE_ID') {
    global.PERCENT_APPLICATION_INDEX += 1
    try {
      global.PERCENT_APPLICATION_FIELDS.push(JSON.parse(data.result))
    } catch (err) {
      console.log('Error from APPLICATION_FIELD_LIST_BY_MODULE_ID')
      console.log(err)
    }
    if (
      global.PERCENT_APPLICATION_INDEX ===
      global.PRECENT_APPLICATION_FIELD_COUNT
    ) {
      // console.log(global.PERCENT_APPLICATION_FIELDS)
      usersController.getSocketIdById(data.userId, (err, userInfo) => {
        console.log(
          'RES_APPLICATION_FIELD_LIST_BY_MODULE_ID',
          userInfo.socketId
        )
        io.to(userInfo.socketId).emit(
          'RES_APPLICATION_FIELD_LIST_BY_MODULE_ID',
          global.PERCENT_APPLICATION_FIELDS
        )
      })
    }
  } else if (data.method === 'SOLUTION_PERCENT') {
    global.PERCENT_SOLUTION_INDEX += 1
    try {
      global.PERCENT_SOLUTIONS.push(JSON.parse(data.result))
    } catch (err) {
      console.log('Error from APPLICATION_FIELD_LIST_BY_MODULE_ID')
      console.log(err)
    }
    if (global.PERCENT_SOLUTION_INDEX === global.PERCENT_SOLUTION_COUNT) {
      // console.log(global.PERCENT_APPLICATION_FIELDS)
      usersController.getSocketIdById(data.userId, (err, userInfo) => {
        console.log('RES_PERCENT_SOLUTION', userInfo.socketId)
        io.to(userInfo.socketId).emit(
          'RES_PERCENT_SOLUTION',
          global.PERCENT_SOLUTIONS
        )
      })
    }
  }
}

exports.reconnectDevice = (socket, deviceId) => {
  deviceController.updateSocketId(deviceId, socket.id, (err, result) => {
    console.log('Updated device socketId: ' + socket.id)
  })
}
