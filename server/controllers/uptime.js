const { Uptime } = require('../database/models')
const Promise = require('bluebird')
const mongoose = require('mongoose')
const { dateFromDay, timeFromSecond, dayOfYearFromDate } = require('../utils')

exports.update = deviceId => {
  const now = new Date()
  Uptime.aggregate(
    [
      {
        $project: {
          year: { $year: { date: '$createdAt' } },
          month: { $month: { date: '$createdAt' } },
          date: {
            $dayOfMonth: { date: '$createdAt' }
          }
        }
      },
      {
        $match: {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate()
        }
      }
    ],
    (err, data) => {
      if (data) {
        if (data.length > 0) {
          Uptime.update({ _id: data[0]._id }, { $inc: { onlineSeconds: 1 } })
            .then(result => {})
            .catch(err => {})
        } else {
          new Uptime({
            date: now,
            onlineSeconds: 1,
            deviceId: deviceId
          }).save()
        }
      }
    }
  )
}

exports.analysis = (req, res) => {
  const startDate = new Date(req.body.startDate)
  const endDate = new Date(req.body.endDate)
  const deviceId = req.body.deviceId

  let days = []
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(dayOfYearFromDate(d))
  }

  Uptime.aggregate(
    [
      {
        $project: {
          day: {
            $dayOfYear: { date: '$createdAt', timezone: 'Asia/Hong_Kong' }
          },
          onlineSeconds: 1,
          deviceId: 1
        }
      },
      {
        $match: {
          deviceId: mongoose.Types.ObjectId(deviceId)
        }
      }
    ],
    (err, uptimeDatas) => {
      Promise.map(days, day => {
        const data = uptimeDatas.find(data => {
          if (data.day === day) {
            return data
          }
        })
        let onlineTime = '-'
        let offlineTime = '-'
        if (data) {
          onlineTime = timeFromSecond(data.onlineSeconds)
          offlineTime = timeFromSecond(86400 - data.onlineSeconds)
        }

        const date = dateFromDay(day)
        const str_date =
          date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate()

        return {
          date: str_date,
          onlineTime: onlineTime,
          offlineTime: offlineTime
        }
      }).then(results => {
        res.status(200).json(results)
      })
    }
  )
}
