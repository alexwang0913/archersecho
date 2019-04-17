/**
 * Module dependencies.
 */
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const socket = require("./sockets");

// const compression = require('compression')
/**
 * Create Express server.
 */
const app = express();

// Use native ES6 Promises since mongoose's are deprecated.
mongoose.Promise = global.Promise;

//const mongoUrl =
// "mongodb://statusreport:statusreport123@ds133547.mlab.com:33547/statusreport";
const mongoUrl = "mongodb://archersecho.com:27017/ArchersEcho";
// const mongoUrl = "mongodb://18.224.4.211:27017/ArchersEcho";
// Connect to the database
mongoose.connect(mongoUrl, { useNewUrlParser: true });

// Fail on connection error.
mongoose.connection.on("error", error => {
  throw error;
});

/**
 * Express configuration.
 */

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,cache-control"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of mddleware
  next();
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb"
  })
);
// app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0')
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
app.set("port", port);

/**
 * Property APIs
 */
const { apiRoutes } = require("./routes");
app.use("/api", apiRoutes);

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    if (req.session) {
      req.session.returnTo = req.originalUrl;
    }
  } else if (
    req.user &&
    (req.path === "/account" || req.path.match(/^\/api/))
  ) {
    if (req.session) {
      req.session.returnTo = req.originalUrl;
    }
  }
  next();
});

app.use(express.static(path.join(__dirname, "../uploads")));

app.use(
  express.static(path.join(__dirname, "../dist"), {
    maxAge: 31557600000,
    setHeaders: function(res) {
      res.set({
        "Cache-control": "no-store, no-cache",
        Pragma: "no-cache",
        Expires: "0"
      });
    }
  })
);

app.use(
  express.static(path.join(__dirname, "../dist/admin"), {
    maxAge: 31557600000,
    setHeaders: function(res) {
      res.set({
        "Cache-control": "no-store, no-cache",
        Pragma: "no-cache",
        Expires: "0"
      });
    }
  })
);

app.use((req, res) => {
  if (req.path.includes("/admin")) {
    res.sendFile(path.join(__dirname, "../dist/admin/index.html"));
  } else {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  }
});
const host = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
app.set("host", host);

//initialize a simple http server
const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    "App is running at http://%s:%d in %s mode",
    host,
    port,
    app.get("env")
  );
});

require("./services");

const io = require("socket.io")(server);
socket(io);
