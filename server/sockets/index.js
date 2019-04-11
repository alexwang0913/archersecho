const {
  cpuMemoryUtilizationController,
  deviceController,
  archerController,
  supportTicketController,
  instanceController,
  enrollmentController
} = require("../controllers");
const userSocket = require("./user");
const dashboardSocket = require("./dashboard");
const deviceSocket = require("./device");
const dbConnectSocket = require("./dbConnect");
const archerSocket = require("./archer");
const instanceSocket = require("./instance");

module.exports = io => {
  io.on("connection", socket => {
    console.log("socket connected:" + socket.id);
    // console.log('socket IpAddress:' + socket.handshake.address)

    // deviceSocket.onConnection(socket)
    // userSocket.onConnection(socket)

    socket.on("disconnect", () => {
      console.log("socket disconnected: " + socket.id);
      deviceSocket.onDisconnect(socket);
      userSocket.onDisconnect(socket);
    });

    /** User socket listeners */
    socket.on("REQ_LOGIN", data => {
      userSocket.webLogin(socket, data);
    });
    socket.on("REQ_USER_CONNECTED", userId => {
      userSocket.userConnect(socket.id, userId, err => {
        socket.emit("RES_USER_CONNECTED", socket.id);
      });
    });

    /** Dashboard socket listeners */
    socket.on("REQ_GET_USER_LOGIN_COUNT", data => {
      dashboardSocket.userLoginCount(io, data);
    });
    socket.on("REQ_DATAFEED_HISTSORY", userId => {
      dashboardSocket.getDatafeedHistory(io, userId);
    });
    socket.on("REQ_APPLICATION_FIELD_LIST_BY_MODULE_ID", data => {
      dashboardSocket.getApplicationFieldListByModuleId(io, data);
    });
    socket.on("REQ_GET_ARCHERS", userId => {
      dashboardSocket.getArchersByUserId(userId, (err, archers) => {
        let result = [];
        if (err) {
          console.log("error from REQ_GET_ARCHERS");
          console.log(err);
        } else {
          result = archers;
        }
        socket.emit("RES_GET_ARCHERS", result);
      });
    });
    socket.on("REQ_APPLICATION_PERCENT", data => {
      dashboardSocket.getApplicationPercent(io, data);
    });
    socket.on("REQ_SOLUTION_PERCENT", data => {
      dashboardSocket.getSolutionPercent(io, data);
    });

    /** StatusReporter listeners */
    socket.on("REQUEST", req => {
      const data = JSON.parse(req);
      dbConnectSocket.responseFromStatusRepoter(io, socket, data);
    });
    socket.on("RECONNECT_DEVICE", deviceId => {
      console.log(
        "RECONNECT DEVICE: " + deviceId + "on SocketID: " + socket.id
      );
      dbConnectSocket.reconnectDevice(socket, deviceId);
    });

    /** Archer listeners */
    socket.on("REQ_DB_CONFIGURATION", data => {
      archerSocket.getDbConfiguration(io, data);
    });
    socket.on("REQ_ACR", data => {
      archerSocket.getConfigReport(io, data);
    });
    // socket.on('REQ_CONFIGURE_DATA', data => {
    //   archerSocket.getConfigData(io, data)
    // })
    socket.on("REQ_INSTALLATION_HISTORY", data => {
      archerSocket.installationHistory(io, data);
    });
    socket.on("REQ_INSTANCE_SUMMARY", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_FILE_REPOSITORY", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_APPLICATIONS", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_SOLUTIONS", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_VALUE_LIST", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_TOP_FIELD", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_ACR_DATA_FEED", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_USER_GROUPS_ROLES", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_LOGIN_HISTORY", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_CURRENT_USER_PEAK", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_JOBS_COMPLETED", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_JOB_QUEUED", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_JOB_ENGINE", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_INSTANCE_DB", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_TABES_BY_ROW", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_DB_TABLES", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_TABLES_BY_SIZE", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_INSTALLATION_RESPORT", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_WINDOWS", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_WINDOWS_SERVICE", data => {
      archerSocket.getConfigData(io, data);
    });
    socket.on("REQ_SQL_SERVER", data => {
      archerSocket.getConfigData(io, data);
    });

    /** SupportTicket listeners */
    socket.on("REQ_SUPPORT_TICKET", data => {
      archerController.generateSupportTicket(data, ticketInfo => {
        socket.emit("RES_SUPPORT_TICKET", ticketInfo);
      });
    });
    socket.on("REQ_SUPPORT_TICKET_PRODUCTION", data => {
      archerSocket.getSupportTicketProduction(io, data);
    });
    socket.on("REQ_SUPPORT_TICKET_VERSION", data => {
      archerSocket.getSupportTicketVersion(io, data);
    });
    socket.on("REQ_SAVE_SUPPORT_TICKET_MAIL", data => {
      supportTicketController.saveTicketMail(data);
    });
    socket.on("REQ_GET_SUPPORT_TICKET_MAIL", ticketId => {
      supportTicketController.getTicketMail(ticketId, mail => {
        socket.emit("RES_GET_SUPPORT_TICKET_MAIL", mail);
      });
    });

    /** Instance listeners */
    socket.on("REQ_DATA_FEED", data => {
      instanceSocket.getDatafeed(io, data);
    });
    socket.on("REQ_INSTANCE_INFORMATION", data => {
      instanceSocket.getInstanceInformation(io, data);
    });
    socket.on("REQ_APPLICATION_FIELD", data => {
      instanceSocket.getApplicationField(io, data);
    });
    socket.on("REQ_APPLICATION_FIELD_COUNT", data => {
      instanceSocket.getApplicationFieldCount(io, data);
    });
    socket.on("REQ_DATAFEED_STATISTIC", data => {
      instanceSocket.getDatafeedStatistic(io, data);
    });
    socket.on("REQ_CALCULATED_FIELD", data => {
      instanceSocket.getCalculatedField(io, data);
    });
    socket.on("REQ_CALCULATED_FIELD_COUNT", data => {
      instanceSocket.getCalculatedFieldCount(io, data);
    });
    socket.on("REQ_INSTANCE_LOGIN_HEATMAP", data => {
      instanceSocket.getInstanceLoginHeatmap(io, data);
    });
    socket.on("REQ_INSTANCE_NOTIFICATION_DETAIL", data => {
      instanceSocket.getNotificaionDetail(io, data);
    });
    socket.on("REQ_RUNNING_JOB_DETAIL", data => {
      instanceSocket.getRunningJobDetails(io, data);
    });
    socket.on("REQ_RUNNING_JOBS_SUMMARY", data => {
      instanceSocket.getRunningJobsSummary(io, data);
    });
    socket.on("REQ_AVAILABLE_JOB_SUMMARY", data => {
      instanceSocket.getAvailableJobSummary(io, data);
    });
    socket.on("REQ_ALL_JOB_SUMMARY", data => {
      instanceSocket.getAllJobSummary(io, data);
    });
    socket.on("REQ_JOB_COMPLETED", data => {
      instanceSocket.getJobCompleted(io, data);
    });
    socket.on("REQ_JOB_FAILED", data => {
      instanceSocket.getJobFailed(io, data);
    });
    socket.on("REQ_SEARCH_INDEX", data => {
      instanceSocket.getSearchDetail(io, data);
    });
    socket.on("REQ_CONTENT_CREATED", data => {
      instanceSocket.getContentCreated(io, data);
    });
    socket.on("REQ_CONTENT_UPDATED", data => {
      instanceSocket.getContentUpdated(io, data);
    });
    socket.on("REQ_LDAP_ERROR_SUMMARY", data => {
      instanceSocket.getLdapErrorSummary(io, data);
    });
    socket.on("REQ_CALCULATED_FIELD_ERROR", data => {
      instanceSocket.getCalculatedFieldError(io, data);
    });
    socket.on("REQ_GET_INSTANCES", archerId => {
      instanceController.getListByArcherId(archerId, (err, instances) => {
        let result = [];
        if (err) {
          console.log("Error from Get_InstanceList_By_ArcherId");
          console.log(err);
        } else {
          result = instances;
        }
        socket.emit("RES_GET_INSTANCES", result);
      });
    });

    /** Device listeners */
    socket.on("REQ_CPU_MEMORY_UTILIZATION", deviceId => {
      cpuMemoryUtilizationController.getUtilizationData(
        deviceId,
        (err, result) => {
          socket.emit("RES_CPU_MEMORY_UTILIZATION", result);
        }
      );
    });
    socket.on("REQ_DEVICE_DETAIL", deviceId => {
      deviceController.getDeviceDetail(deviceId, result => {
        socket.emit("RES_DEVICE_DETAIL", result);
      });
    });
    socket.on("REQ_SYSTEM_UPTIME", deviceId => {
      deviceController.getUptime(deviceId, (err, data) => {
        let result = "";
        if (data[0]) {
          result = data[0].cpu.Uptime;
        }
        socket.emit("RES_SYSTEM_UPTIME", result);
      });
    });
    socket.on("REQ_PROCESS_LIST", deviceId => {
      deviceController.getProcessList(deviceId, (err, result) => {
        socket.emit("RES_PROCESS_LIST", result);
      });
    });
    socket.on("REQ_UPDATE_PROCESS_STATUS", data => {
      deviceController.setActiveProcess(data, (err, result) => {
        if (err) {
          console.log(err);
        }
      });
    });
    socket.on("REQ_WINDOWS_EVENT_LOG", deviceId => {
      deviceController.getWindowsEventLogs(deviceId, (err, data) => {
        let result = [];
        if (err) {
          result = [];
        } else {
          data.map(log => {
            if (log !== null) {
              result.push(log);
            }
          });
        }
        socket.emit("RES_WINDOWS_EVENT_LOG", result);
      });
    });
    socket.on("REQ_GET_DEVICES", archerId => {
      deviceController.getDeviceListByArcherId(archerId, (err, data) => {
        let result = [];
        if (err) {
          result = [];
        } else {
          result = data;
        }
        socket.emit("RES_GET_DEVICES", result);
      });
    });

    /**Enrollment wizard listeners */
    socket.on("REQ_PUBLISH_ENROLLMENT", data => {
      enrollmentController.add(data, (err, result) => {
        let status = err ? false : true;
        socket.emit("RES_PUBLISH_ENROLLMENT", status);
      });
    });
  });
};
