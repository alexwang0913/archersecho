const { deviceController } = require('../controllers')

exports.onConnection = socket => {
  const ip = socket.handshake.address
  deviceController.updateSocketIdByIpAddress(socket.id, ip, (err, result) => {
    if (err) {
      console.log(err)
    }
  })
}

exports.onDisconnect = socket => {
  deviceController.removeSocketId(socket.id, (err, result) => {
    if (err) {
      console.log(err)
    }
  })
}
