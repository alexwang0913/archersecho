const { WindowsEventLog } = require('../database/models')

exports.add = (req, res) => {
  new WindowsEventLog(req.body)
    .save()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.list = (req, res) => {
  WindowsEventLog.find({})
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.update = (req, res) => {
  WindowsEventLog.update({ _id: req.params.id }, { $set: req.body })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.remove = (req, res) => {
  WindowsEventLog.remove({ _id: req.params.id })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
