const express = require("express");

const { archerController } = require("../controllers");

const router = express.Router();

router.get("/list/:userId", archerController.list);
router.get("/dbInfo/:archerId", archerController.getDatabaseInformation);
router.get("/getErrorLogs/:archerId", archerController.getErrorLogs);
router.get("/getInstances/:archerId", archerController.getInstances);
router.get(
  "/generateSupportTicket/:archerId",
  archerController.generateSupportTicket
);
router.get("/getSupportTickets/:archerId", archerController.getSupportTickets);
router.get(
  "/getDbConfiguration/:archerId",
  archerController.getDbConfiguration
);
router.get(
  "/getErrorLogByDeviceId/:deviceId",
  archerController.getErrorLogByDeviceId
);
router.get("/noHelpDeskList", archerController.getNoHelpDeskList);
router.get("/helpDeskList", archerController.getHelpDeskList);
router.get("/unallowHelpDesk/:id", archerController.unallowHelpDesk);
router.get("/:archerId", archerController.getArcherInfo);

router.post("/add", archerController.add);
router.post("/addInstance", archerController.addInstance);
router.post("/getAverageData", archerController.getAverageData);
router.post("/updateArcher", archerController.updateArcher);
router.post("/removeInstance", archerController.removeInstance);
router.post("/allowHelpDesk", archerController.addHelpDeskTicket);
router.post("/updateInstance", archerController.updateInstance);

router.put(
  "/updateDbInfo/:archerId",
  archerController.updateDatabaseInformation
);

router.delete("/:id", archerController.delete);

module.exports = router;
