const { PortentialSupport } = require('../database/models')

exports.add = async (req, res) => {
  let newObj = new PortentialSupport({
    machineType: req.body.machineType,
    compareType: req.body.compareType,
    amount: req.body.amount,
    time: req.body.time,
    recommendation: req.body.recommendation
  })
  newObj
    .save()
    .then(result => {
      res.status(200).json({ data: result })
    })
    .catch(err => {
      res.status(500).json({ err: err })
    })
}

exports.list = async (req, res) => {
  PortentialSupport.find({})
    .then(potentialSupports => {
      let result = []
      potentialSupports.forEach(support => {
        let description = ''
        description += support.machineType === 1 ? 'CPU' : 'Memory'
        description += support.compareType === 1 ? ' > ' : ' < '
        description += support.amount
        description += support.machineType === 1 ? '%' : 'Mb'
        description += ' for '
        description += support.time + 'hours'
        result.push({
          description: description,
          recommendation: support.recommendation,
          machineType: support.machineType,
          compareType: support.compareType,
          amount: support.amount,
          time: support.time,
          id: support._id
        })
      })
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({ err: err })
    })
}

exports.update = async (req, res) => {
  PortentialSupport.findByIdAndUpdate(req.params.id, { $set: req.body })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.delete = (req, res) => {
  PortentialSupport.remove({ _id: req.params.id })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
