const { UploadFile } = require('../database/models')

exports.add = async (req, res) => {
  // await UploadFile.remove({ name: req.body.name })

  const uploadFile = new UploadFile(req.body)

  uploadFile
    .save()
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.list = (req, res) => {
  UploadFile.find({})
    .sort({ createdAt: -1 })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.delete = (req, res) => {
  UploadFile.remove({ _id: req.params.id })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
