const { deviceController, usersController } = require('../controllers')
const { Archer, Device } = require('../database/models')
const global = require('./global')
const Promise = require('bluebird')
const mongoose = require('mongoose')

exports.userLoginCount = (io, data) => {
  const { userId } = data

  deviceController.getDeviceListByUserId(userId, (err, devices) => {
    if (devices) {
      global.GET_USER_LOGIN_COUNT_DEVICE_COUNT = 0
      global.GET_USER_LOGIN_COUNT_DEVICE_INDEX = 0
      global.USER_LOGIN_COUNT = 0
      // global.GET_USER_LOGIN_COUNT_DEVICE_COUNT = devices.length
      for (const device of devices) {
        if (device.socketId) {
          global.GET_USER_LOGIN_COUNT_DEVICE_COUNT += 1
          const data = {
            status: 200,
            data: {
              query: `
                        USE instance1;
                        SELECT COUNT(*) as loginUserCount FROM viewUserList WHERE logged_in=1;
                        `,
              method: 'GET_USER_LOGIN_COUNT',
              userId: userId,
              type: 0,
              deviceId: device._id
            },
            deviceId: device._id
          }
          console.log('Send GET_USER_LOGIN_COUNT to:' + device.socketId)
          io.to(device.socketId).emit('RESPONSE', data)
        }
      }
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_GET_USER_LOGIN_COUNT', 0)
      })
    }
  })
}

exports.getDatafeedHistory = (io, userId) => {
  Archer.find({ userId: userId }).then(archers => {
    Promise.map(archers, archer => {
      return new Promise((resolve, reject) => {
        return Device.findOne({
          archerId: mongoose.Types.ObjectId(archer._id),
          socketId: { $ne: null }
        }).then(device => {
          if (!device) {
            return resolve(null)
          }
          return resolve({
            instances: archer.instances,
            socketId: device.socketId,
            deviceId: device._id
          })
        })
      })
    }).then(results => {
      global.DATAFEED_HISTORY = []
      global.DATAFEED_HISTORY_COUNT = 0
      global.DATAFEED_HISTORY_INDEX = 0
      let flag = false
      for (const result of results) {
        if (result) {
          flag = true
          global.DATAFEED_HISTORY_COUNT += 1
          let query = ''
          for (const instance of result.instances) {
            query += `USE ${instance};
          SELECT status_id, create_date FROM tblDataFeedHistory ORDER BY create_date ASC
          `
          }
          const data = {
            status: 200,
            data: {
              query: query,
              method: 'DATAFEED_HIHSTORY',
              userId: userId,
              deviceId: result.deviceId,
              type: 0
            },
            deviceId: result.deviceId
          }
          console.log('Send DATAFEED_HIHSTORY to: ' + result.socketId)
          io.to(result.socketId).emit('RESPONSE', data)
        }
      }
      if (!flag) {
        usersController.getSocketIdById(userId, (err, userInfo) => {
          io.to(userInfo.socketId).emit('RES_DATAFEED_HISTORY', null)
        })
      }
    })
  })
}

exports.getApplicationFieldListByModuleId = (io, data) => {
  const { archer, userId } = data
  deviceController.getDbDeviceByArcher(archer._id, (err, deviceInfo) => {
    global.PRECENT_APPLICATION_FIELD_COUNT = 0
    global.PERCENT_APPLICATION_INDEX = 0
    global.PERCENT_APPLICATION_FIELDS = []
    for (const instance of archer.instances) {
      if (deviceInfo) {
        global.PRECENT_APPLICATION_FIELD_COUNT += 1
        const query = `
        USE ${instance.database};
        SELECT A.module_id, MIN(A.result) AS state FROM (
          SELECT A.module_id, A.field_id, A.field_type_id, 
          (CASE 
            WHEN A.field_type_id = 1 THEN 
            (
              (SELECT COUNT(*) FROM tblIVFieldDefText WHERE field_id = A.field_id) | 
              (SELECT COUNT(*) FROM tblIVFieldHistory WHERE field_id = A.field_id) | 
              (SELECT COUNT(*) FROM tblIVTextData WHERE field_id = A.field_id) | 
              (SELECT COUNT(*) FROM tblIVTextDataEncrypted WHERE field_id = A.field_id) | 
              (SELECT COUNT(*) FROM tblIVTextDataEncrypted WHERE field_id = A.field_id) | 
              (SELECT COUNT(*) FROM tblIVVendorFieldMap WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 2 THEN
            (
              (SELECT COUNT(*) FROM tblIVDecimalData WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVDecimalDataEncrypted WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVFieldDefNumeric WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVNumericRange WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 3 THEN
            (
              (SELECT COUNT(*) FROM tblIVDateData WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVDateDataEncrypted WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVFieldDefDate WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 4 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefDisplayAttribute WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVFieldDefValueList WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVSelectContent WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 5 THEN
            (
              0
            )
            WHEN A.field_type_id = 6 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDef WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVFieldDefTrackingId WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVLayoutObject WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 7 THEN
            (
              (SELECT COUNT(*) FROM tblIVExternalDoc WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVFieldDefExternalLink WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 8 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefUserGroup WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVGroupContent WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVUserContent WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 9 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefCrossRef WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVModuleContent WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 10 THEN
            (
              0
            )
            WHEN A.field_type_id = 11 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefAttachment WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 12 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefImage WHERE field_id = A.field_id)
            )
            WHEN A.field_type_id = 13 THEN
            (
              0
            )
            WHEN A.field_type_id = 14 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefCAST WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 16 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefMatrix WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 17 THEN
            (
              0
            )
            WHEN A.field_type_id = 19 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefIPAddress WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 20 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefRecordStatus WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 21 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefFirstPublished WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 22 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefLastUpdated WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 23 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefRelatedRecord WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 24 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefSubform WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 25 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefHistoryLog WHERE field_id = A.field_id) |
              (SELECT COUNT(*) FROM tblIVFieldHistoryOptions WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 26 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefDiscussion WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 27 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefMultiReference WHERE field_id = A.field_id) 
            )
            WHEN A.field_type_id = 28 THEN
            (
              0
            )
            WHEN A.field_type_id = 29 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefContentAccessHistory WHERE field_id = A.field_id) 	
            )
            WHEN A.field_type_id = 30 THEN
            (
              0
            )
            WHEN A.field_type_id = 31 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefScheduler WHERE field_id = A.field_id) 	
            )
            WHEN A.field_type_id = 1000 THEN
            (
              0
            )
            WHEN A.field_type_id = 1001 THEN
            (
              (SELECT COUNT(*) FROM tblIVFieldDefScoreCard WHERE field_id = A.field_id) 	
            )
            ELSE 0 
          END)as result
          FROM viewApplicationFieldList A
          ) A
          GROUP BY A.module_id
          ORDER BY A.module_id
      `
        const data = {
          status: 200,
          data: {
            query: query,
            method: 'APPLICATION_FIELD_LIST_BY_MODULE_ID',
            userId: userId,
            deviceId: deviceInfo.deviceId,
            type: 0
          },
          deviceId: deviceInfo.deviceId
        }
        console.log(
          'Send APPLICATION_FIELD_LIST_BY_MODULE_ID to' + deviceInfo.socketId
        )
        io.to(deviceInfo.socketId).emit('RESPONSE', data)
      } else {
        usersController.getSocketIdById(userId, (err, userInfo) => {
          io.to(userInfo.socketId).emit(
            'RES_APPLICATION_FIELD_LIST_BY_MODULE_ID',
            []
          )
        })
      }
    }
  })
}

exports.getArchersByUserId = (userId, callback) => {
  Archer.find({ userId: { $in: userId } }, callback)
}

exports.getApplicationPercent = (io, data) => {
  const { archer, fields } = data
  deviceController.getDbDeviceByArcher(archer._id, (err, deviceInfo) => {
    Promise.map(fields, field => {
      const fieldIds = field.field_ids.split(',')
      const fieldTypes = field.field_type_ids.split(',')
    })
  })
}

exports.getSolutionPercent = (io, data) => {
  const { archer, userId } = data
  deviceController.getDbDeviceByArcher(archer._id, (err, deviceInfo) => {
    global.PERCENT_SOLUTION_COUNT = 0
    global.PERCENT_SOLUTION_INDEX = 0
    global.PERCENT_SOLUTIONS = []
    for (const instance of archer.instances) {
      if (deviceInfo) {
        global.PERCENT_SOLUTION_COUNT += 1
        const query = `
          USE ${instance.database};
          SELECT A.level_id, MIN(A.result) AS state FROM (
            SELECT A.field_id, A.field_type_id, A.level_id,
            (CASE 
              WHEN A.field_type_id = 1 THEN 
              (
                (SELECT COUNT(*) FROM tblIVFieldDefText WHERE field_id = A.field_id) | 
                (SELECT COUNT(*) FROM tblIVFieldHistory WHERE field_id = A.field_id) | 
                (SELECT COUNT(*) FROM tblIVTextData WHERE field_id = A.field_id) | 
                (SELECT COUNT(*) FROM tblIVTextDataEncrypted WHERE field_id = A.field_id) | 
                (SELECT COUNT(*) FROM tblIVTextDataEncrypted WHERE field_id = A.field_id) | 
                (SELECT COUNT(*) FROM tblIVVendorFieldMap WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 2 THEN
              (
                (SELECT COUNT(*) FROM tblIVDecimalData WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVDecimalDataEncrypted WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVFieldDefNumeric WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVNumericRange WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 3 THEN
              (
                (SELECT COUNT(*) FROM tblIVDateData WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVDateDataEncrypted WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVFieldDefDate WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 4 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefDisplayAttribute WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVFieldDefValueList WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVSelectContent WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 5 THEN
              (
                0
              )
              WHEN A.field_type_id = 6 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDef WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVFieldDefTrackingId WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVLayoutObject WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 7 THEN
              (
                (SELECT COUNT(*) FROM tblIVExternalDoc WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVFieldDefExternalLink WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 8 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefUserGroup WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVGroupContent WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVUserContent WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 9 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefCrossRef WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVModuleContent WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 10 THEN
              (
                0
              )
              WHEN A.field_type_id = 11 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefAttachment WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 12 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefImage WHERE field_id = A.field_id)
              )
              WHEN A.field_type_id = 13 THEN
              (
                0
              )
              WHEN A.field_type_id = 14 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefCAST WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 16 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefMatrix WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 17 THEN
              (
                0
              )
              WHEN A.field_type_id = 19 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefIPAddress WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 20 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefRecordStatus WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 21 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefFirstPublished WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 22 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefLastUpdated WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 23 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefRelatedRecord WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 24 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefSubform WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 25 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefHistoryLog WHERE field_id = A.field_id) |
                (SELECT COUNT(*) FROM tblIVFieldHistoryOptions WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 26 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefDiscussion WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 27 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefMultiReference WHERE field_id = A.field_id) 
              )
              WHEN A.field_type_id = 28 THEN
              (
                0
              )
              WHEN A.field_type_id = 29 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefContentAccessHistory WHERE field_id = A.field_id) 	
              )
              WHEN A.field_type_id = 30 THEN
              (
                0
              )
              WHEN A.field_type_id = 31 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefScheduler WHERE field_id = A.field_id) 	
              )
              WHEN A.field_type_id = 1000 THEN
              (
                0
              )
              WHEN A.field_type_id = 1001 THEN
              (
                (SELECT COUNT(*) FROM tblIVFieldDefScoreCard WHERE field_id = A.field_id) 	
              )
              ELSE 0 
            END)as result
            FROM viewApplicationFieldList A
            ) A
            GROUP BY A.level_id
            ORDER BY A.level_id
        `
        const data = {
          status: 200,
          data: {
            query: query,
            method: 'SOLUTION_PERCENT',
            userId: userId,
            deviceId: deviceInfo.deviceId,
            type: 0
          },
          deviceId: deviceInfo.deviceId
        }
        console.log('Send SOLUTION_PERCENT to' + deviceInfo.socketId)
        io.to(deviceInfo.socketId).emit('RESPONSE', data)
      } else {
        usersController.getSocketIdById(userId, (err, userInfo) => {
          io.to(userInfo.socketId).emit('RES_PERCENT_SOLUTION', [])
        })
      }
    }
  })
}
