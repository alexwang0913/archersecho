const { HelpDesk, User, Archer } = require('../database/models')
const Promise = require('bluebird')
const mongoose = require('mongoose')

exports.addTicket = (req, res) => {
  const { assignTo, description, name, creator } = req.body
  Promise.map(assignTo, userName => {
    return User.findOne({ userId: userName }, { _id: 1 })
      .then(user => {
        return user
      })
      .catch(err => {
        return null
      })
  }).then(result => {
    let users = []
    for (const user of result) {
      if (user) {
        users.push(user._id)
      }
    }
    new HelpDesk({
      name: name,
      description: description,
      openedBy: creator,
      openDate: new Date(),
      assignedTo: users
    })
      .save()
      .then(result => {
        res.json(result)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  })
}

exports.getAllList = (req, res) => {
  HelpDesk.find({})
    .populate('openedBy', 'userId')
    .populate('closedBy', 'userId')
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.deleteTicket = (req, res) => {
  const { id } = req.params
  HelpDesk.remove({ _id: id })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getInfo = (req, res) => {
  const { id } = req.params
  HelpDesk.findById(id)
    .populate('openedBy', 'userId')
    .populate('closedBy', 'userId')
    .populate('assignedTo', 'userId')
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.updateStatus = (req, res) => {
  const { status, id } = req.body
  HelpDesk.updateOne({ _id: id }, { $set: { status: status } })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.saveNote = (req, res) => {
  const { id, note } = req.body
  HelpDesk.updateOne({ _id: id }, { $set: { note: note } })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.close = (req, res) => {
  const { id, closedBy } = req.body
  HelpDesk.updateOne(
    { _id: id },
    { $set: { status: 3, closedBy: closedBy, closeDate: new Date() } }
  )
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.validateUser = (req, res) => {
  const { userId } = req.params
  Archer.find({ userId: userId, helpDeskTicket: true })
    .count()
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(result)
    })
}

exports.getMyTickets = (req, res) => {
  const { userId } = req.params
  HelpDesk.find({ openedBy: userId })
    .populate('closedBy', 'userId')
    .populate('assignedTo', 'userId')
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      res.status(500).json(error)
    })
}

exports.update = (req, res) => {
  HelpDesk.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getRequestTickets = (req, res) => {
  const { userId } = req.params
  HelpDesk.find({ assignedTo: mongoose.Types.ObjectId(userId) })
    .populate('openedBy', 'userId')
    .populate('closedBy', 'userId')
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
