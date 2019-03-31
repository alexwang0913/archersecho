const { User } = require('../database/models')
const Promise = require('bluebird')
/**
 * Check user's password update time every day
 */
setInterval(async () => {
  const users = await User.find({})
  const now = new Date()
  let blockUsers = []
  for (const user of users) {
    if (
      now.getTime() - new Date(user.passwordUpdatedAt).getTime() >=
      1000 * 3600 * 24 * 100
    ) {
      blockUsers = user
    }
    Promise.map(blockUsers, user => {
      User.update({ _id: user._id }, { $set: { isActive: false } })
    })
  }
}, 1000 * 3600 * 24)
