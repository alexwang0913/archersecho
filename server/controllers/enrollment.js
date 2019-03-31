const { Archer, Device } = require('../database/models')
const Promise = require('bluebird')

exports.add = (data, cb) => {
  const { archerName, devices, instances, userId } = data
  new Archer({
    name: archerName,
    instances: instances,
    userId: userId
  })
    .save()
    .then(newArcher => {
      const archerId = newArcher._id
      return Promise.map(devices, device => {
        const defaultProcess = [
          { Name: 'Archer.Services.Indexing' },
          { Name: 'ArcherTech.JobFramework.Cache' },
          { Name: 'ArcherTech.JobFramework.Host' },
          { Name: 'ArcherTech.Services.ConfigurationService' },
          { Name: 'ArcherTech.Services.WorkflowService' },
          { Name: 'ArcherTech.Services.CachingService' },
          { Name: 'SemanticLogging-svc.exe' }
        ]
        return new Device({
          name: device.name,
          type: device.type,
          process: defaultProcess,
          archerId: archerId
        })
          .save()
          .then(result => {
            return result
          })
          .catch(err => {
            return null
          })
      })
        .then(results => {
          cb(null, results)
        })
        .catch(err => {
          cb(err, null)
        })
    })
    .catch(err => {
      cb(err, null)
    })
}
