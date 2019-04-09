const express = require("express");

const {
  deviceController,
  cpuMemoryUtilizationController,
  uptimeController
} = require("../controllers");

const router = express.Router();

router.post("/", deviceController.add);
router.post("/addProcess", deviceController.addProcess);
router.post("/activeProcess", deviceController.setActiveProcess);
router.post("/updateName", deviceController.updateName);
router.post("/updateProcess", deviceController.updateProcess);
router.post("/resetDevice/:deviceId", deviceController.resetDevice);
router.post("/searchError", deviceController.searchError);
router.post("/dbConfiguration", deviceController.getDbConfiguration);
router.post("/getUptimeData", uptimeController.analysis);
router.post("/getDatafeedStatistic", deviceController.getDatafeedStatistic);
router.post("/verifyUser", deviceController.verifyUser);
router.post("/eventLog", deviceController.addEventLog);
router.post("/iisLog", deviceController.addIisLog);
router.post("/updateDetail", deviceController.updateDetail);

router.get("/info/:deviceId", deviceController.info);
router.get("/errors/:deviceId", deviceController.getErrorList);
router.get(
  "/currentArcherVersion/:deviceId",
  deviceController.getCurrentArcherVersion
);
router.get(
  "/generateSupportTicket/:deviceId",
  deviceController.generateSupportTicket
);
router.get(
  "/supportTicketList/:deviceId",
  deviceController.getSupportTicketList
);
router.get("/downloadError/:fileName", deviceController.downloadError);
router.get(
  "/cpuMemoryUtilization/:deviceId",
  cpuMemoryUtilizationController.getUtilizationData
);
router.get(
  "/instanceInformation/:deviceId",
  deviceController.getInstanceInformation
);
router.get("/getByArcherId/:archerId", deviceController.getByArcherId);
router.get(
  "/getEventLogs/:deviceId",
  deviceController.getWindowsEventLogsForDevice
);
router.get("/deviceLogin/:deviceId", deviceController.deviceLogin);
router.get("/iisLog/:deviceId", deviceController.getIisLog);
router.get("/getProcess/:deviceId", deviceController.getProcessList);
router.get("/:userId", deviceController.list);

router.delete("/process", deviceController.deleteProcess);
router.delete("/:deviceId", deviceController.delete);

router.put("/setMssqlInfo/:deviceId", deviceController.setDbInfo);
router.put("/:deviceId", deviceController.update);

module.exports = router;
