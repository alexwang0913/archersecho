/*
 * This file is used to build the API routes, we may have
 * different routes for views and the like
 */

const express = require("express");

const userRoutes = require("./users"); //use the user route shit
const authRoutes = require("./auth");
const deviceRoutes = require("./device");
const portentialSupportRoutes = require("./portentialSupport");
const msSqlRoutes = require("./mssql.js");
const dashboardRoutes = require("./dashboard.js");
const ticketRoutes = require("./ticket.js");
const instanceRoutes = require("./instance");
const archerRoutes = require("./archer.js");
const ruleRoutes = require("./rule.js");
const slackRoutes = require("./slack.js");
const teamRoutes = require("./team.js");
const fileUploadRoutes = require("./file-upload.js");
const uploadRoutes = require("./upload.js");
const windowsEventLogRoutes = require("./windowsEventLog.js");
const xmlConvert = require("./xmlConvert");
const helpDesk = require("./helpDesk");

const router = express.Router(); //make a new router

router.use("/users", userRoutes); //tell it to use the userRoutes
router.use("/auth", authRoutes);
router.use("/device", deviceRoutes);
router.use("/portential_support", portentialSupportRoutes);
router.use("/mssql", msSqlRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/ticket", ticketRoutes);
router.use("/instance", instanceRoutes);
router.use("/archer", archerRoutes);
router.use("/rule", ruleRoutes);
router.use("/slack", slackRoutes);
router.use("/team", teamRoutes);
router.use("/file_uploads", fileUploadRoutes);
router.use("/upload", uploadRoutes);
router.use("/eventLog", windowsEventLogRoutes);
router.use("/convert", xmlConvert);
router.use("/helpDesk", helpDesk);

module.exports = router;
