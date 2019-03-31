const { deviceController, usersController } = require('../controllers')

exports.getDbConfiguration = (io, data) => {
  const { archerId, userId, database } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archerId: ' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `  USE ${database};
                    SELECT section_group, section_name, data_point_group_key, data_point, data_point_value FROM tblACRReportData WITH (NOLOCK) WHERE report_id = (SELECT MAX(report_id) FROM tblACRReportData) ORDER BY data_id;
                    `,
          method: 'DB_CONFIGURATION',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send DB_CONFIGURATION to:' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_DB_CONFIGURATION', [])
      })
    }
  })
}

exports.getConfigReport = (io, data) => {
  const { archerId, userId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archer id: ' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT TOP(1) * FROM tblACRReports WITH (NOLOCK) ORDER BY report_id DESC
          `,
          method: 'ARCHER_CONFIG_REPORT',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send ARCHER_CONFIG_REPORT to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_ACR', [])
      })
    }
  })
}

exports.getConfigData = (io, data) => {
  const { archerId, userId, sectionName, database, method } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archer id: ' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${database};
            SELECT 
              section_group, 
              section_name, 
              data_point_group_key, 
              data_point, 
              data_point_value 
            FROM tblACRReportData WITH (NOLOCK) 
            WHERE report_id = (SELECT MAX(report_id) FROM tblACRReportData) 
              AND section_name = '${sectionName}'
            ORDER BY data_id
          `,
          method: method,
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log(`Send ${method} to: ${device.socketId}`)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      let response = ''
      if (method === 'INSTANCE_SUMMARY') {
        response = 'RES_INSTANCE_SUMMARY'
      } else if (method === 'FILE_REPOSITORY') {
        response = 'RES_FILE_REPOSITORY'
      } else if (method === 'APPLICATIONS') {
        response = 'RES_APPLICATIONS'
      } else if (method === 'SOLUTIONS') {
        response = 'RES_SOLUTIONS'
      } else if (method === 'VALUES_LIST') {
        response = 'RES_VALUES_LIST'
      } else if (method === 'TOP_FIELDS') {
        response = 'RES_TOP_FIELD'
      } else if (method === 'ACR_DATA_FEED') {
        response = 'RES_ACR_DATA_FEED'
      } else if (method === 'USER_GROUPS_ROLES') {
        response = 'RES_USER_GROUPS_ROLES'
      } else if (method === 'LOGIN_HISTORY') {
        response = 'RES_LOGIN_HISTORY'
      } else if (method === 'CURRENT_USER_PEAK') {
        response = 'RES_CURRENT_USER_PEAK'
      } else if (method === 'JOBS_COMPLETED') {
        response = 'RES_JOBS_COMPLETED'
      } else if (method === 'JOB_QUEUED') {
        response = 'RES_JOB_QUEUED'
      } else if (method === 'JOB_ENGINE') {
        response = 'RES_JOB_ENGINE'
      } else if (method === 'INSTANCE_DB') {
        response = 'RES_INSTANCE_DB'
      } else if (method === 'TABES_BY_ROW') {
        response = 'RES_TABES_BY_ROW'
      } else if (method === 'DB_TABLES') {
        response = 'RES_DB_TABLES'
      } else if (method === 'TABLES_BY_SIZE') {
        response = 'RES_TABLES_BY_SIZE'
      } else if (method === 'INSTALLATION_RESPORT') {
        response = 'RES_INSTALLATION_RESPORT'
      } else if (method === 'WINDOWS') {
        response = 'RES_WINDOWS_SERVICE'
      } else if (method === 'SQL_SERVER') {
        response = 'RES_SQL_SERVER'
      }
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit(response, [])
      })
    }
  })
}

exports.installationHistory = (io, data) => {
  const { archerId, userId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archer id: ' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT * FROM tblApplicationInstallHistory
          `,
          method: 'INSTALLATION_HISTORY',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send INSTALLATION_HISTORY to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_INSTALLATION_HISTORY', [])
      })
    }
  })
}

exports.getSupportTicketProduction = (io, data) => {
  const { archerId, userId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archer id: ' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT TOP 1 data_point_value
            FROM tblACRReportData
            WHERE data_point = 'Status'
          `,
          method: 'SUPPORT_TICKET_PRODUCTION',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send SUPPORT_TICKET_PRODUCTION to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_SUPPORT_TICKET_PRODUCTION', null)
      })
    }
  })
}

exports.getSupportTicketVersion = (io, data) => {
  const { archerId, userId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archer id: ' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT TOP 1 data_point_value
            FROM tblACRReportData
            WHERE data_point = 'Instance Use Category'
          `,
          method: 'SUPPORT_TICKET_VERSION',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send SUPPORT_TICKET_VERSION to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_SUPPORT_TICKET_VERSION', null)
      })
    }
  })
}
