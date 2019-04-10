const {
  Device,
  PortentialSupport,
  SupportTicket,
  Instance,
  Archer,
  IisLog,
  WindowsEventLog
} = require("../database/models");
const { decrypt } = require("../utils");
const sql = require("mssql");
const Promise = require("bluebird");

const request = require("request");
const mongoose = require("mongoose");

const cpuMemoryUtilizationController = require("./cpuMemoryUtilization");
const uptimeController = require("./uptime");

exports.add = (req, res) => {
  const defaultProcess = [
    { Name: "Archer.Services.Indexing" },
    { Name: "ArcherTech.JobFramework.Cache" },
    { Name: "ArcherTech.JobFramework.Host" },
    { Name: "ArcherTech.Services.ConfigurationService" },
    { Name: "ArcherTech.Services.WorkflowService" },
    { Name: "ArcherTech.Services.CachingService" },
    { Name: "SemanticLogging-svc.exe" }
  ];
  let deviceObj = new Device({
    name: req.body.name,
    type: req.body.deviceType,
    process: defaultProcess,
    archerId: req.body.archerId
  });

  deviceObj
    .save()
    .then(device => {
      res.send({ status: 200, data: device });
    })
    .catch(err => {
      res.send({ status: 500, err: err });
    });
};

exports.list = async (req, res) => {
  const { userId } = req.params;
  const archers = await Archer.find({ userId: userId });
  let archerIds = [];
  for (const archer of archers) {
    archerIds.push(archer._id);
  }
  Device.find({ archerId: { $in: archerIds } })
    .then(devices => {
      res.status(200).json(devices);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.info = async (req, res) => {
  const deviceId = req.params.deviceId;
  Device.findById(deviceId)
    .then(device => {
      let status = -1;
      if (!device.updateTime) {
        status = 2;
      } else if (device.socketId) {
        status = 0;
      } else if (!device.socketId) {
        status = 1;
      } else {
        const now = new Date().getTime();
        const updatedAt = new Date(device.updatedAt).getTime();
        const diffSec = (now - updatedAt) / 1000;
        if (diffSec <= 60 * 10) {
          status = 0;
        } else {
          status = 1;
        }
      }
      if (status === 0) {
        let runningProcess = true;
        for (let process of device.process) {
          if (!process.Status && process.isActive) {
            runningProcess = false;
            break;
          }
        }
        if (!runningProcess) {
          status = 3;
        }
      }
      const result = {
        status: status,
        cpu: device.cpu,
        memory: device.memory,
        mssql: device.mssql,
        iisLogs: device.iisLogs,
        type: device.type,
        name: device.name,
        archerId: device.archerId,
        network: device.network,
        drives: device.drives,
        errorLogs: device.errorLogs,
        id: device._id
      };
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });

  // Device.findById(deviceId, { updateTime: 1, process: 1 })
  //   .exec()
  //   .then(async device => {
  //     if (!device) {
  //       return res.send({ status: 500, err: 'No device' })
  //     }
  //     const currentTime = new Date().getTime()
  //     const lastUpdateTime = new Date(device.updateTime).getTime()
  //     const diffSecond = (currentTime - lastUpdateTime) / 1000
  //     const delayTime = 10

  //     let updateObj = {}
  //     if (diffSecond < delayTime) {
  //       // online
  //       updateObj = { status: -1 }

  //       let runningProcess = true
  //       for (let process of device.process) {
  //         if (!process.Status && process.isActive) {
  //           runningProcess = false
  //           break
  //         }
  //       }
  //       if (runningProcess) {
  //         updateObj = { status: 0 }
  //       } else {
  //         updateObj = { status: 3 }
  //       }
  //     } else if (!device.updateTime) {
  //       // never communicate with webServer
  //       updateObj = { status: 2 }
  //     } else {
  // updateObj = {
  //   cpu: {
  //     Usage: 0,
  //     ProcessCount: 0,
  //     Uptime: 0
  //   },
  //   memory: {
  //     Usage: 0,
  //     Available: 0
  //   },
  //   status: 1,
  //   'process.$[].Status': false
  // }
  //     }
  //     await Device.update({ _id: deviceId }, { $set: updateObj })
  //     // console.log(updateObj.status)

  //     Device.findById(deviceId)
  //       .then(updatedDevice => {
  //         res.send({ status: 200, data: updatedDevice })
  //       })
  //       .catch(err => {
  //         res.send({ status: 500, err: err })
  //       })
  //   })
  //   .catch(err => {
  //     res.send({ status: 500, err: err })
  //   })
};

exports.addProcess = (req, res) => {
  const { deviceId, name } = req.body;
  Device.findByIdAndUpdate(deviceId, {
    $push: {
      process: {
        Name: name
      }
    }
  })
    .then(device => {
      return res.send({ status: 200, data: device });
    })
    .catch(err => {
      res.send({ status: 500, err: err });
    });
};

exports.deleteProcess = (req, res) => {
  const { deviceId, processId } = req.body;
  Device.findByIdAndUpdate(deviceId, {
    $pull: { process: { _id: processId } }
  })
    .then(result => {
      res.send({ status: 200 });
    })
    .catch(err => {
      res.send({ status: 500, err: err });
    });
};

exports.delete = (req, res) => {
  const { deviceId } = req.params;
  Device.remove({ _id: deviceId })
    .then(device => {
      res.send({ status: 200 });
    })
    .catch(err => {
      res.send({ status: 500, err: err });
    });
};

exports.update = async (req, res) => {
  console.log("--Data from StatsuReporter");
  // console.log('deviceId: ' + req.params.deviceId)
  const deviceId = req.params.deviceId;
  const decStr = decrypt(req.body.content);
  const data = JSON.parse(decStr);

  /**
   * Add Cpu and Memory Utilization data
   */
  let memoryUsage = (data.Memory.Available / data.Memory.Total) * 100;
  // console.log('Device Id: ' + deviceId)
  // console.log('Memory Usage:' + memoryUsage)
  const cpu_memory_utils_data = {
    deviceId: deviceId,
    cpuUsage: data.Cpu.Usage,
    memoryAvailable: memoryUsage
  };
  cpuMemoryUtilizationController.add(cpu_memory_utils_data);

  // Verify Process not running status
  let processNotRunning = false;
  for (const process of data.Process) {
    if (!process.Status) {
      processNotRunning = true;
    }
  }

  /**
   * Update service uptime
   */
  uptimeController.update(deviceId);

  let process = [];
  let updateDeviceInfo = {
    cpu: data.Cpu,
    memory: {
      Usage: data.Memory.Usage,
      Available: (data.Memory.Available / data.Memory.Total) * 100
    },
    network: data.Network,
    updateTime: new Date(),
    drives: data.Drives,
    status: processNotRunning ? 3 : 0
  };

  const updateProcessInfo = data.Process;
  Device.findByIdAndUpdate(deviceId, {
    $set: updateDeviceInfo
  })
    .then(device => {
      // process = device.process
      device.process.map(p => {
        if (p.isActive) {
          process.push(p);
        }
      });
      Promise.all(
        updateProcessInfo.map(process => {
          Device.update(
            {
              "process._id": process._id
            },
            {
              $set: {
                "process.$.Status": process.Status,
                "process.$.updateAt": new Date()
              }
            }
          )
            .then(device => {
              return device;
            })
            .catch(err => {
              return err;
            });
        })
      )
        .then(result => {
          res.send({ status: 200, data: process });
        })
        .catch(err => {
          return err;
        });
    })
    .catch(err => {
      return err;
    });
};

// exports.setActiveProcess = (data, cb) => {
//   const { processId, status } = data;
//   Device.update(
//     { "process._id": processId },
//     { $set: { "process.$.isActive": status } }
//   )
//     .then(device => {
//       cb(null, device);
//     })
//     .catch(err => {
//       cb(err);
//     });
// };

exports.setActiveProcess = (req, res) => {
  const { processId, status } = req.body;
  Device.update(
    { "process._id": processId },
    { $set: { "process.$.isActive": status } }
  )
    .then(device => {
      res.json(device);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateName = (req, res) => {
  const { deviceId, name } = req.body;
  Device.update({ _id: deviceId }, { $set: { name: name } })
    .then(result => {
      res.send({ status: 200, data: result });
    })
    .catch(err => {
      res.send({ status: 500, err: err });
    });
};

exports.updateProcess = (req, res) => {
  const { processId, processName } = req.body;
  Device.update(
    { "process._id": processId },
    { $set: { "process.$.Name": processName } }
  )
    .then(result => {
      res.send({ status: 200, data: result });
    })
    .catch(err => {
      res.send({ status: 500, err });
    });
};

exports.resetDevice = (req, res) => {
  const { deviceId } = req.params;
  Device.update(
    { _id: deviceId },
    {
      $set: {
        cpu: { Usage: 0, ProcessCount: 0, Uptime: 0 },
        memory: { Usage: 0, Available: 0 },
        "process.Status": false
      }
    }
  )
    .then(result => {
      res.send({ status: 200, data: result });
    })
    .catch(err => {
      res.send({ status: 500, err: err });
    });
};

exports.setDbInfo = async (req, res) => {
  res.send({ status: 200, data: "OK" });
  // const { deviceId } = req.params
  // const mssqlInfo = JSON.parse(decrypt(req.body.content))

  // const device = await Device.findById(deviceId)
  // const { archerId } = device
  // Archer.update({ _id: archerId }, { $set: { dbInformation: mssqlInfo } })
  //   .then(result => {
  //     res.send({ status: 200, data: result })
  //   })
  //   .catch(err => {
  //     res.send({ status: 500, err: err })
  //   })
};

exports.getDbConfiguration = (req, res) => {
  const config = req.body;

  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`SELECT section_group, section_name, data_point_group_key, data_point, data_point_value FROM tblACRReportData WITH (NOLOCK) WHERE report_id = (SELECT MAX(report_id) FROM tblACRReportData) ORDER BY data_id`;
    })
    .then(result => {
      res.status(200).json(result.recordset);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getErrorList = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const data = await Device.find({ _id: deviceId }, { errorList: 1 });
    res.status(200).json(data[0].errorList);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getCurrentArcherVersion = async (req, res) => {
  const deviceId = req.params.deviceId;
  const data = await Device.find({ _id: deviceId }, { mssql: 1 });
  const config = {
    server: data[0].mssql.server,
    user: data[0].mssql.user,
    password: data[0].mssql.password,
    database: data[0].mssql.database
  };
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`SELECT TOP (1) application_version from tblConfigApplication`;
    })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.generateSupportTicket = async (req, res) => {
  const deviceId = req.params.deviceId;

  const device = await Device.findById(deviceId);
  const now = new Date();
  // Generate Temp UserInfo
  const tempUserName = "tUser" + device.name.replace(/\s/g, "") + now.getTime();
  const tempPassword = "tPwd" + device.name.replace(/\s/g, "") + now.getTime();

  Device.find({ _id: deviceId }, { mssql: 1 }).then(async data => {
    const config = {
      server: data[0].mssql.server,
      user: data[0].mssql.user,
      password: data[0].mssql.password,
      database: data[0].mssql.database
    };
    sql.close();
    let version = "";
    try {
      await sql.connect(config);
      const query =
        "SELECT TOP (1) application_version from tblConfigApplication";
      const result = await sql.query(query);
      version = result.recordset[0].application_version;
    } catch (err) {
      version = "XXX";
    }
    new SupportTicket({
      userName: tempUserName,
      password: tempPassword,
      deviceId: deviceId
    })
      .save()
      .then(supportTicket => {
        const result = {
          tempUserName: tempUserName,
          tempPassword: tempPassword,
          version: version
        };
        res.status(200).json(result);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};

exports.getSupportTicketList = (req, res) => {
  const { deviceId } = req.params;
  SupportTicket.find({ deviceId: deviceId })
    .then(tickets => {
      res.status(200).json(tickets);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.downloadError = (req, res) => {
  const { fileName } = req.params;
  const file = `/home/archersecho/uploads/errors/${fileName}`;
  res.download(file);
};

exports.getInstanceInformation = async (req, res) => {
  const { deviceId } = req.params;

  const device = await Device.findById(deviceId);
  const data_points = [
    "instance",
    "Instance Use Category",
    "Record Count of Licensed Applications",
    "Default Time Zone",
    "Single Sign-On Mode",
    "# of Active Data Feeds",
    "# Logins In Last Hour",
    "File Repository Size",
    "File Repository Count"
  ];

  Instance.find().then(instances => {
    Promise.map(instances, instance => {
      const config = {
        server: device.mssql.server,
        user: device.mssql.user,
        password: device.mssql.password,
        database: instance.name,
        connectionTimeout: 999999,
        requestTimeout: 999999
      };
      return Promise.map(data_points, data_point => {
        return new sql.ConnectionPool(config)
          .connect()
          .then(pool => {
            return pool.query`SELECT data_point, data_point_value FROM tblACRReportData WHERE data_point=${data_point}`;
          })
          .then(query_result => {
            return {
              field: data_point,
              record: query_result.recordsets[0]
            };
          });
      }).then(results => {
        return {
          instance: instance.name,
          data: results
        };
      });
    }).then(results => {
      res.status(200).json(results);
    });
  });
};

exports.searchError = async (req, res) => {
  const { keyword, archerId } = req.body;
  const { errorLogs } = await Archer.findById(archerId);

  let index = 0;
  let result = [];
  for (const err of errorLogs) {
    request.get(err.url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        if (body.indexOf(keyword) > -1) {
          result.push(err);
        }
      }
      index++;
      if (index === errorLogs.length) {
        res.status(200).json(result);
      }
    });
  }
};

exports.getDatafeedStatistic = async (req, res) => {
  const archerId = req.body.archerId;
  const archer = await Archer.findById(archerId);
  const config = archer.dbInformation;
  config["database"] = req.body.instance;

  const statistic = {
    Running: 0,
    Completed: 0,
    Faulted: 0,
    Warning: 0,
    Terminating: 0,
    Terminated: 0,
    Pending: 0
  };

  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`
        SELECT status_id, start_time, end_time 
        FROM tblDataFeedHistory 
        WHERE CAST(start_time AS date) >= CAST(${
          req.body.startDate
        } AS date) AND CAST(end_time AS date) <= CAST(${
        req.body.endDate
      } AS date)
      `;
    })
    .then(result => {
      const datafeeds = result.recordset;
      for (const datafeed of datafeeds) {
        switch (datafeed.status_id) {
          case 1:
            statistic["Running"]++;
            break;
          case 2:
            statistic["Completed"]++;
            break;
          case 3:
            statistic["Faulted"]++;
            break;
          case 4:
            statistic["Warning"]++;
            break;
          case 5:
            statistic["Terminating"]++;
            break;
          case 6:
            statistic["Terminated"]++;
            break;
          case 7:
            statistic["Pending"]++;
        }
      }
      res.status(200).json(statistic);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getByArcherId = (req, res) => {
  const { archerId } = req.params;
  Device.find({ archerId: archerId })
    .then(devices => {
      devices.map(device => {
        if (!device.socketId) device.status = 1;
      });
      res.status(200).json(devices);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.verifyUser = async (req, res) => {
  const { deviceId, userId } = req.body;

  // get archer ids from the userId
  const archers = await Archer.find({ userId: userId });
  let archerIds = [];
  for (const archer of archers) {
    archerIds.push(archer._id);
  }

  // get deviceInfo from deviceId
  const { archerId } = await Device.findById(deviceId);

  let result = false;
  for (const id of archerIds) {
    if (id.toString() === archerId.toString()) {
      result = true;
    }
  }
  res.status(200).json(result);
};

exports.addEventLog = (req, res) => {
  const { eventLogs, deviceId } = JSON.parse(decrypt(req.body.content));
  // const { eventLogs, deviceId } = req.body

  Device.update({ _id: deviceId }, { $set: { eventLogs: eventLogs } })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getWindowsEventLogs = (deviceId, cb) => {
  // const { deviceId } = req.params
  Device.findById(deviceId, {
    "eventLogs.EventID": 1,
    "eventLogs.TimeGenerated": 1
  })
    .then(device => {
      // res.status(200).json(device.eventLogs)
      const eventLogs = device.eventLogs;
      return Promise.map(eventLogs, eventLog => {
        return WindowsEventLog.findOne({ eventId: eventLog.EventID })
          .then(result => {
            return result;
          })
          .catch(() => {
            return null;
          });
      }).then(results => {
        cb(null, results);
      });
    })
    .catch(err => {
      // res.status(500).json(err)
      cb(err, null);
    });
};

exports.getWindowsEventLogsForDevice = (req, res) => {
  const { deviceId } = req.params;
  Device.findById(deviceId, {
    "eventLogs.EventID": 1,
    "eventLogs.TimeGenerated": 1
  })
    .then(device => {
      const eventLogs = device.eventLogs;
      return Promise.map(eventLogs, eventLog => {
        return WindowsEventLog.findOne({ eventId: eventLog.EventID })
          .then(result => {
            return result;
          })
          .catch(() => {
            return null;
          });
      }).then(results => {
        res.json(results);
      });
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

/**
 * Changed for WebSocket
 */
exports.deviceLogin = (deviceId, cb) => {
  Device.findById(deviceId, { process: 1, name: 1 })
    .then(result => {
      // console.log(result)
      cb(null, result);
    })
    .catch(err => {
      // console.log(err)
      cb(err, null);
    });
};

exports.addIisLog = (data, cb) => {
  const { deviceId, url, fileName, hashCode } = data;

  // Get data from the log from client.
  request.get(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let iisLogs = [];
      for (const log of body.split("\n")) {
        if (log.indexOf("#") < 0) {
          const data = log.split(" ");
          if (data[14] && data[14].indexOf("\r") > 0) {
            iisLogs.push({
              date: data[0],
              time: data[1],
              archerIpAddress: data[2],
              method: data[3],
              page: data[4],
              port: parseInt(data[6]),
              userIpAddress: data[8],
              statusCode: parseInt(data[11]),
              loadTime: parseInt(data[14].replace("\r", "")),
              deviceId: deviceId
            });
          }
        }
      }
      IisLog.insertMany(iisLogs, (err, result) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });

  // Save s3 bucket into db
  Device.update(
    { _id: deviceId },
    {
      $set: {
        iisLogs: {
          fileName: fileName,
          hashCode: hashCode,
          url: url
        }
      }
    }
  )
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err, null);
    });
};

exports.getIisLog = (req, res) => {
  Device.findById(req.params.deviceId)
    .then(device => {
      res.status(200).json(device.iisLogs);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.updateSocketInfo = (data, cb) => {
  const { deviceId, socketId, ipAddress, publicDeviceId } = data;

  Device.update(
    { _id: deviceId },
    {
      $set: {
        socketId: socketId,
        ipAddress: ipAddress,
        publicDeviceId: publicDeviceId
      }
    }
  )
    .then(result => {
      // console.log(result)
      cb(null, result);
    })
    .catch(err => {
      // console.log(err)
      cb(err, null);
    });
};

exports.getDeviceListByUserId = async (userId, cb) => {
  const archers = await Archer.find({
    userId: mongoose.Types.ObjectId(userId)
  });
  let archerIds = [];
  for (const archer of archers) {
    archerIds.push(archer._id);
  }
  Device.find({ archerId: { $in: archerIds } })
    .then(devices => {
      cb(null, devices);
    })
    .catch(err => {
      cb(err, null);
    });
};

exports.updateSocketIdByIpAddress = (socketId, ipAddress, cb) => {
  Device.updateMany({ ipAddress: ipAddress }, { $set: { socketId: socketId } })
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err, null);
    });
};

exports.removeSocketId = (socketId, cb) => {
  Device.update({ socketId: socketId }, { $set: { socketId: null } }, cb);
};

exports.getDbDeviceByArcher = (archerId, cb) => {
  Device.aggregate(
    [
      {
        $match: { type: /3/, archerId: mongoose.Types.ObjectId(archerId) }
      },
      {
        $group: {
          _id: "$ipAddress",
          socketId: { $first: "$socketId" },
          deviceId: { $first: "$_id" }
        }
      },
      {
        $match: {
          socketId: { $ne: null }
        }
      }
    ],
    (err, data) => {
      if (err) {
        cb(err);
      } else {
        cb(null, data[0]);
      }
    }
  );
};

exports.updateSocketId = (deviceId, socketId, cb) => {
  Device.updateMany(
    {
      $or: [
        {
          _id: deviceId
        },
        {
          publicDeviceId: deviceId
        }
      ]
    },
    {
      $set: {
        socketId: socketId
      }
    }
  )
    .then(result => {
      cb(null, result);
    })
    .catch(err => {
      cb(err, null);
    });
};

exports.getDeviceDetail = (deviceId, cb) => {
  // Device.find(
  //   { _id: deviceId },
  //   { name: 1, status: 1, cpu: 1, memory: 1, drives: 1, network: 1 },
  //   cb
  // )
  Device.findById(deviceId).then(device => {
    let status = -1;
    if (!device.updateTime) {
      status = 2;
    } else if (device.socketId) {
      status = 0;
    } else {
      const now = new Date().getTime();
      const updatedAt = new Date(device.updateTime).getTime();
      const diffSec = (now - updatedAt) / 1000;
      if (diffSec <= 60 * 2) {
        status = 0;
      } else {
        status = 1;
      }
    }
    if (status === 0) {
      let runningProcess = true;
      for (let process of device.process) {
        if (!process.Status && process.isActive) {
          runningProcess = false;
          break;
        }
      }
      if (!runningProcess) {
        status = 3;
      }
    }
    const result = {
      status: status,
      cpu: device.cpu,
      memory: device.memory,
      mssql: device.mssql,
      iisLogs: device.iisLogs,
      type: device.type,
      name: device.name,
      process: device.process,
      archerId: device.archerId,
      network: device.network,
      drives: device.drives,
      errorLogs: device.errorLogs,
      _id: device._id
    };

    if (status === 1) {
      const updateObj = {
        cpu: {
          Usage: 0,
          ProcessCount: 0,
          Uptime: 0
        },
        memory: {
          Usage: 0,
          Available: 0
        },
        status: 1,
        "process.$[].Status": false
      };
      Device.update({ _id: deviceId }, { $set: updateObj })
        .then(result => {
          // console.log('Success in ResetDeviceInfo')
        })
        .catch(err => {
          console.log("Error in Reset DeviceInfo");
          console.log(err);
        });
    }

    cb(result);
  });
};

exports.getUptime = (deviceId, cb) => {
  Device.find({ _id: deviceId }, { "cpu.Uptime": 1 }, cb);
};

// exports.getProcessList = (deviceId, cb) => {
//   Device.findOne({ _id: deviceId }, { process: 1 }, cb);
// };
exports.getProcessList = (req, res) => {
  Device.findOne({ _id: req.params.deviceId }, { process: 1 })
    .then(device => {
      res.json(device);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getDeviceListByArcherId = (archerId, cb) => {
  Device.find(
    { archerId: archerId },
    {
      _id: 1,
      name: 1,
      createdAt: 1,
      type: 1,
      process: 1,
      socketId: 1,
      updateTime: 1
    }
  )
    .then(devices => {
      let result = [];
      for (const device of devices) {
        let status = -1;
        if (!device.updateTime) {
          status = 2;
        } else if (device.socketId) {
          status = 0;
        } else {
          const now = new Date().getTime();
          const updatedAt = new Date(device.updateTime).getTime();
          const diffSec = (now - updatedAt) / 1000;
          if (diffSec <= 60 * 2) {
            status = 0;
          } else {
            status = 1;
          }
        }
        if (status === 0) {
          let runningProcess = true;
          for (let process of device.process) {
            if (!process.Status && process.isActive) {
              runningProcess = false;
              break;
            }
          }
          if (!runningProcess) {
            status = 3;
          }
        }
        result.push({
          id: device._id,
          name: device.name,
          createdAt: device.createdAt,
          type: device.type,
          status: status
        });
      }
      cb(null, result);
    })
    .catch(err => {
      cb(err, null);
    });
};

exports.updateDetail = (req, res) => {
  const { id, name, deviceType } = req.body;
  Device.update(
    { _id: id },
    {
      $set: {
        name: name,
        type: deviceType
      }
    }
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(200).json(err);
    });
};
