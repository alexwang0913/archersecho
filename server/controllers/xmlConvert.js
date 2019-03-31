// const XSLT = require('xslt')
// const { xsltProcess, xmlParse } = require('xslt-processor')
const jsonxml = require('jsontoxml')
const request = require('request')

exports.convert = (req, res) => {
  const { url } = req.body
  request.get(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const { resources } = JSON.parse(body)
      const data = resources[0]
      const structure = getStructure(data)
      res.json(structure)
    }
  })
}

const getStructure = obj => {
  let structure = []
  const keys = Object.keys(obj)
  for (const key of keys) {
    const data = obj[key]

    if (data.length > 0 && typeof data === 'object') {
      structure.push({ name: key, children: getStructure(data[0]) })
    } else {
      structure.push({ name: key })
    }
  }
  return structure
}

exports.exportData = (req, res) => {
  const { xmlUrl, structure } = req.body
  res.download(xmlUrl)
}
