const { User, Admin, SupportTicket, TempLogin } = require("../database/models");
const bcrypt = require("bcrypt");
const { timeFromSecond } = require("../utils");
const { google } = require("googleapis");
const googleClient = require("../config/google.json");

const googleConfig = {
  clientId: googleClient.web.client_id,
  clientSecret: googleClient.web.client_secret,
  redirect: googleClient.web.redirect_uris[0]
};

const scopes = ["https://www.googleapis.com/auth/plus.me"];
const oauth2Client = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
);

exports.login = async (data, ip, cb) => {
  // Get ip address from client request and save it to the <tempLogin> collection
  // const ip = (
  //   req.headers['x-forwarded-for'] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   req.connection.socket.remoteAddress
  // ).split(',')[0]
  const tempLogin = await TempLogin.find({ ipAddress: ip });
  const now = new Date();
  if (tempLogin && tempLogin.length > 0) {
    if (tempLogin[0].isPanelty) {
      const passTime = now.getTime() - tempLogin[0].paneltyTime.getTime();
      if (passTime < 1000 * 60 * 15) {
        // return res.send({ status: 300 })
        return cb({ status: 300 });
      } else {
        await TempLogin.update(
          { ipAddress: ip },
          {
            $set: {
              isPanelty: false,
              paneltyTime: null
            }
          }
        );
      }
    } else if (tempLogin[0].isLogin) {
      // return cb({ status: 302 })
    }
  }

  const { userId, password } = data;

  await User.find({ userId: userId })
    .exec()
    .then(user => {
      if (
        user.length > 0 &&
        bcrypt.compareSync(password, user[0]["password"])
      ) {
        TempLogin.find({ ipAddress: ip }).then(tempLoginInfo => {
          if (tempLoginInfo.length > 0) {
            TempLogin.update(
              { ipAddress: ip },
              {
                $set: {
                  isLogin: true,
                  loginTime: new Date(),
                  isPanelty: false,
                  paneltyTime: null,
                  userId: userId
                }
              }
            ).then(() => {
              cb({ status: 200, data: user[0] });
            });
          } else {
            new TempLogin({
              ipAddress: ip,
              isLogin: true,
              loginTime: new Date(),
              userId: userId
            })
              .save()
              .then(() => {
                cb({ status: 200, data: user[0] });
              });
          }
        });
      } else {
        TempLogin.find({ ipAddress: ip }).then(tempLoginInfo => {
          if (tempLoginInfo.length > 0) {
            if (tempLoginInfo[0].attemptCount == 1) {
              // panelty
              TempLogin.update(
                { ipAddress: ip },
                {
                  $set: {
                    attemptCount: 0,
                    isPanelty: true,
                    paneltyTime: new Date()
                  }
                }
              ).then(() => {
                // res.send({ status: 300 })
                cb({ status: 300 });
              });
            } else {
              // try again but increase attemptCount
              TempLogin.update(
                { ipAddress: ip },
                { $inc: { attemptCount: 1 } }
              ).then(() => {
                // res.send({
                //   status: 301,
                //   attemptCount: ++tempLoginInfo[0].attemptCount
                // })
                cb({
                  status: 301,
                  attemptCount: ++tempLoginInfo[0].attemptCount
                });
              });
            }
          } else {
            // add new tempLogin information
            new TempLogin({ ipAddress: ip }).save().then(() => {
              cb({ status: 301, attemptCount: 0 });
            });
          }
        });
      }
    })
    .catch(err => {
      cb({ status: 500, err: err });
    });
};

exports.signUp = (req, res) => {
  let userInfo = req.body;
  const plainText = userInfo["password"];
  userInfo["password"] = bcrypt.hashSync(plainText, 10);

  new User(userInfo)
    .save()
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.adminLogin = (req, res) => {
  Admin.find({ userId: req.body.userId, password: req.body.password })
    .then(admin => {
      if (admin.length > 0) {
        res.status(200).json(admin[0]);
      } else {
        res.status(500).json({ err: "No User" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.temporaryLogin = (req, res) => {
  SupportTicket.find({
    userName: req.body.userId,
    password: req.body.password,
    isActive: true
  })
    .then(ticket => {
      if (ticket.length > 0) {
        SupportTicket.update(
          { _id: ticket[0]._id },
          { $set: { isLogin: true } }
        )
          .then(() => {
            res.status(200).json(ticket[0]);
          })
          .catch(err => {
            res.status(500).json(err);
          });
      } else {
        res.status(500).json({ msg: "No user found" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.getLoginAttemptInfo = (req, res) => {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  TempLogin.findOne({ ipAddress: ip })
    .then(tempLoginInfo => {
      res.json(tempLoginInfo);
    })
    .catch(err => {
      res.json(err).status(500);
    });
};

exports.getPaneltyRemainTime = (req, res) => {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  TempLogin.findOne({ ipAddress: ip }).then(tempLoginInfo => {
    const now = new Date();
    const passTime = now.getTime() - tempLoginInfo.paneltyTime.getTime();
    if (passTime < 1000 * 60 * 15) {
      const remainTime = Math.floor((1000 * 60 * 15 - passTime) / 1000);
      res.json({ noPanelty: false, time: timeFromSecond(remainTime) });
    } else {
      TempLogin.update(
        { ipAddress: ip },
        {
          $set: {
            isPanelty: false,
            paneltyTime: null
          }
        }
      ).then(() => {
        res.json({ noPanelty: true, time: 0 });
      });
    }
  });
};

exports.tempLoginOut = (req, res) => {
  const ip = (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  ).split(",")[0];

  TempLogin.update(
    { ipAddress: ip },
    { $set: { isLogin: false, attemptCount: -1 } }
  )
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

exports.googleAuth = async req => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  oauth2Client.on("tokens", tokens => {
    if (tokens.refresh_token) {
      console.log("리프레시 토큰 :", tokens.refresh_token);
    }
    console.log("액세스 토큰:", tokens.access_token);
  });

  // const res = await plus.people.get({ userId: "me" });
  // console.log(`Hello ${res.data.displayName}! ${res.data.id}`);
  // return res.data.displayName;
};

exports.googleLogin = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",

    scope: scopes
  });
  res.send(url);
};
