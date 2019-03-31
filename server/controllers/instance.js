const { Archer, Instance, Device } = require('../database/models')
const sql = require('mssql')
const Promise = require('bluebird')

exports.add = (req, res) => {
  new Instance(req.body)
    .save()
    .then(newInstance => {
      res.status(200).json(newInstance)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.list = (req, res) => {
  Instance.find({})
    .then(instances => {
      res.status(200).json(instances)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.update = (req, res) => {
  Instance.updateOne({ _id: req.params.id }, { $set: req.body })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.stauts(500).json(err)
    })
}

exports.delete = (req, res) => {
  Instance.deleteOne({ _id: req.params.id })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getDataFeeds = async (req, res) => {
  const config = req.body

  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`SELECT datafeed_id, datafeed_name, next_scheduled_date, status, is_active FROM tblDatafeed`
    })
    .then(result => {
      res.status(200).json(result.recordset)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getDataFeedHistory = async (req, res) => {
  const device = await Device.findById(req.body.deviceId)

  const config = {
    server: device.mssql.server,
    user: device.mssql.user,
    password: device.mssql.password,
    database: req.body.instanceName
  }
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`SELECT * FROM tblDataFeedHistory WHERE datafeed_id=${
        req.body.dataFeedId
      }`
    })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getInformation = async (req, res) => {
  const config = req.body

  const data_points = [
    'instance',
    'Instance Use Category',
    'Record Count of Licensed Applications',
    'Default Time Zone',
    'Single Sign-On Mode',
    '# of Active Data Feeds',
    '# Logins In Last Hour',
    'File Repository Size',
    'File Repository Count'
  ]
  Promise.map(data_points, data_point => {
    return new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`SELECT data_point, data_point_value FROM tblACRReportData WHERE data_point=${data_point}`
      })
      .then(query_result => {
        return {
          field: data_point,
          record: query_result.recordsets[0]
        }
      })
  })
    .then(results => {
      res.status(200).json(results)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}

exports.getApplicationFields = async (req, res) => {
  const config = req.body
  Promise.all([
    new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`
        SELECT a.*, b.field_type_name, c.aso_name
        FROM viewApplicationFieldList a 
        LEFT JOIN tblIVFieldType b ON a.field_type_id=b.field_type_id
        LEFT JOIN tblModule c ON a.module_id=c.module_id
        `
      })
      .then(result => {
        return result.recordset
      })
      .catch(err => {
        return null
      }),
    new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`SELECT count(*) as totalCount FROM viewApplicationFieldList`
      })
      .then(result => {
        return result.recordset[0].totalCount
      })
      .catch(err => {
        return -1
      })
  ]).spread((fields, count) => {
    const result = {
      fields: fields,
      count: count
    }
    res.status(200).json(result)
  })
}

exports.getApplicationFieldsBySearch = async (req, res) => {
  const { page, keyword, dbInformation } = req.body

  const startNum = 50 * (page - 1) + 1
  const endNum = 50 * page

  Promise.all([
    new sql.ConnectionPool(dbInformation)
      .connect()
      .then(pool => {
        return pool.query`
      SELECT  *
      FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY a.module_id ) AS RowNum, a.*, b.field_type_name, c.aso_name
                FROM      viewApplicationFieldList a
                LEFT JOIN tblIVFieldType b ON a.field_type_id=b.field_type_id
                LEFT JOIN tblModule c ON a.module_id=c.module_id
                WHERE (field_id LIKE ${keyword} OR field_name LIKE ${keyword} OR [Reports (as display field)] LIKE ${keyword})
              ) AS RowConstrainedResult
      WHERE   RowNum >= ${startNum}
          AND RowNum <= ${endNum}
      ORDER BY RowNum`
      })
      .then(result => {
        return result.recordset
      })
      .catch(err => {
        return err
      }),
    new sql.ConnectionPool(dbInformation)
      .connect()
      .then(pool => {
        return pool.query`SELECT count(*) as totalCount FROM viewApplicationFieldList
        WHERE (field_id LIKE ${keyword} OR field_name LIKE ${keyword} OR [Reports (as display field)] LIKE ${keyword})`
      })
      .then(result => {
        return result.recordset[0].totalCount
      })
      .catch(err => {
        return -1
      })
  ]).spread((fields, count) => {
    const result = { fields: fields, count: count }
    res.status(200).json(result)
  })
}

exports.getCalculatedFields = (req, res) => {
  const config = req.body
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`
      SELECT TOP 10
        m.module_id AS ModuleId,
        lt.level_id AS LevelId, 
        fd.field_id AS FieldId, 
        mt.module_name AS ModuleName, 
        lt.level_name AS LevelName, 
        ft.field_name AS FieldName, 
        ftype.field_type_name AS FieldType, 
        fd.active AS Active, 
        c.calc_order AS CalcOrder, 
        c.formula AS Formula, 
        c.enforce_calc AS Always, 
        c.is_handle_error AS HandleError, 
        c.is_invalid AS Invalid, 
        fd.create_date AS Created, 
        fd.update_date AS Updated
      FROM tblIVFieldDef fd
      JOIN tblIVFieldType ftype ON fd.field_type_id = ftype.field_type_id
      JOIN tblFieldTranslation ft ON fd.field_id = ft.field_id
      JOIN tblLevel l ON fd.level_id = l.level_id
      JOIN tblModule m ON l.module_id = m.module_id
      JOIN tblLevelTranslation lt ON l.level_id = lt.level_id
      JOIN tblModuleTranslation mt ON mt.module_id = m.module_id
      LEFT JOIN tblCalc c ON fd.field_id = c.field_id
      WHERE fd.level_id = l.level_id AND m.module_id = l.module_id AND ftype.field_type_id = fd.field_type_id AND fd.field_id = c.field_id AND ft.language_id = 1
      ORDER BY mt.module_name, lt.level_name, c.calc_order
      `
    })
    .then(result => {
      res.json(result.recordset)
    })
    .catch(err => {
      res.stauts(500).json(err)
    })
}

exports.getListByArcherId = (archerId, cb) => {
  Archer.findById(archerId)
    .then(archer => {
      cb(null, archer.instances)
    })
    .catch(err => {
      cb(err, null)
    })
}
