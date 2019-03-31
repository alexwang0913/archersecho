const { Rule } = require('../database/models')

exports.add = (req, res) => {
  new Rule(req.body)
    .save()
    .then(newRule => {
      res.status(200).json(newRule)
    })
    .catch(err => {
      res.statu(500).json(err)
    })
}

exports.list = (req, res) => {
  Rule.find()
    .then(rules => {
      res.status(200).json(rules)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.update = (req, res) => {
  Rule.update({ _id: req.params.id }, { $set: req.body })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.delete = (req, res) => {
  Rule.remove({ _id: req.params.id })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
