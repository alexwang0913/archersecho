const IV = 'QUJDREVGR0g='
const KEY = 'abcdefghijklmnop'

const encrypt = text => {
  var crypto = require('crypto')
  var alg = 'des-ede-cbc'
  var key = new Buffer(KEY, 'utf-8')
  var iv = new Buffer(IV, 'base64') //This is from c# cipher iv

  var cipher = crypto.createCipheriv(alg, key, iv)
  var encoded = cipher.update(text, 'ascii', 'base64')
  encoded += cipher.final('base64')

  return encoded
}

const decrypt = encryptedText => {
  var crypto = require('crypto')
  var alg = 'des-ede-cbc'
  var key = new Buffer(KEY, 'utf-8')
  var iv = new Buffer(IV, 'base64') //This is from c# cipher iv

  var encrypted = new Buffer(encryptedText, 'base64')
  var decipher = crypto.createDecipheriv(alg, key, iv)
  var decoded = decipher.update(encrypted, 'binary', 'ascii')
  decoded += decipher.final('ascii')

  return decoded
}

const formatDate = date => {
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds()
  )
}

const dateFromDay = day => {
  const now = new Date()
  const date = new Date(now.getFullYear(), 0) // initialize a date in `year-01-01`
  return new Date(date.setDate(day)) // add the number of days
}

const timeFromSecond = second => {
  let hour = Math.floor(second / 3600)
  let min = Math.floor(second / 60)

  if (hour > 0) {
    second -= hour * 3600
    min = Math.floor(second / 60)
    second -= min * 60
    return hour + 'h ' + min + 'm ' + second + 's'
  } else if (min > 0) {
    second -= min * 60
    return min + 'm ' + second + 's'
  } else {
    return second + 's'
  }
}

const dayOfYearFromDate = date => {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date - start
  const oneDay = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / oneDay)
  return day
}

const getFormatDate = date => {
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

module.exports = {
  encrypt,
  decrypt,
  formatDate,
  dateFromDay,
  timeFromSecond,
  dayOfYearFromDate,
  getFormatDate
}
