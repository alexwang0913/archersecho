const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const express = require('express')
const router = express.Router()
const { archerController, deviceController } = require('../controllers')

aws.config.update({
  secretAccessKey: '9nMdfPpMKtt0v2l+1ZRk6O4qtQh4XVKggUggDxgd',
  accessKeyId: 'AKIAJ4ABK6EWMI2HPS2A',
  region: 'us-east-2',
  maxRetries: 10,
  httpOptions: {
    timeout: 1200000
  }
})

const s3 = new aws.S3()

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'archeresecho',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString() + file.originalname)
    }
  })
})

const singleUpload = upload.single('file')

router.post('/', (req, res) => {
  // console.log('File upload start...')
  singleUpload(req, res, err => {
    // console.log('File upload end...')
    // console.log(err)
    if (err) {
      return res.status(500).json(err)
    }
    const response = {
      success: true,
      error: null,
      url: req.file.location
    }
    res.status(200).json(response)
  })
})

const upload_logs = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'archeresecho',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function(req, file, cb) {
      cb(null, file.originalname)
    }
  })
})
const logUpload = upload_logs.single('file')
router.post('/errorLog', (req, res) => {
  logUpload(req, res, err => {
    const errorData = {
      deviceId: req.body.deviceId,
      url: req.file.location,
      name: req.file.originalname,
      hashCode: req.body.hashCode,
      fileName: req.body.fileName
    }
    archerController.addError(errorData, (err, result) => {
      if (err) {
        return res.status(500).json('Failed')
      }
      res.status(200).json('Success')
    })
  })
})

router.post('/iisLog', (req, res) => {
  logUpload(req, res, err => {
    const data = {
      deviceId: req.body.deviceId,
      url: req.file.location,
      fileName: req.body.fileName,
      hashCode: req.body.hashCode
    }
    deviceController.addIisLog(data, (err, result) => {
      if (err) {
        return res.status(500).json('Failed')
      }
      res.status(200).json('Success')
    })
  })
})

router.post('/xml', (req, res) => {
  singleUpload(req, res, err => {
    if (err) {
      return res.status(500).json(err)
    }
    const response = {
      success: true,
      error: null,
      url: req.file.location
    }
    res.status(200).json(response)
  })
})

module.exports = router
