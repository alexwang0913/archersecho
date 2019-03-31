const { authController, usersController } = require('../controllers')
const { User } = require('../database/models')

exports.webLogin = (socket, loginData) => {
  // const ip = socket.handshake.address
  // const ip = socket.request.connection.remoteAddress
  const ip =
    socket.request.headers['x-forwarded-for'] ||
    socket.request.connection.remoteAddress
  console.log('Login ip address:' + ip)
  // console.log(
  //   "socket.request.headers['x-forwarded-for'] : " +
  //     socket.request.headers['x-forwarded-for']
  // )
  // console.log(
  //   'socket.request.connection.remoteAddress: ' +
  //     socket.request.connection.remoteAddress
  // )
  // console.log(
  //   'socket.request.socket.remoteAddress: ' +
  //     socket.request.socket.remoteAddress
  // )
  // console.log(
  //   'socket.request.connection.socket.remoteAddress:' +
  //     socket.request.connection.socket.remoteAddress
  // )
  authController.login(loginData, ip, data => {
    console.log(data)
    // Save socketId if login success
    const { status } = data
    if (status === 200) {
      usersController.insertSocketId(data.data._id, socket.id, ip)
    }

    const result = { data: data, socketId: socket.id }
    socket.emit('RES_LOGIN', result)
  })
}

exports.onConnection = socket => {
  const ip = socket.handshake.address
  usersController.updateSocketIdByIpAddress(socket.id, ip, (err, result) => {
    if (err) {
      console.log(err)
    }
  })
}

exports.onDisconnect = socket => {
  usersController.removeSocketId(socket.id, (err, result) => {
    if (err) {
      console.log(err)
    }
  })
}

exports.userConnect = (socketId, userId, cb) => {
  User.update({ _id: userId }, { $set: { socketId: socketId } })
    .then(result => {
      cb(null, result)
    })
    .catch(err => {
      cb(err)
    })
}
