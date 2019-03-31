const { deviceController, usersController } = require('../controllers')
const global = require('./global')

exports.getDatafeed = (io, data) => {
  const { userId, archerId, instance } = data

  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archerId:' + archerId)
    console.log(device)
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `  USE ${instance};
          SELECT datafeed_id, datafeed_name, next_scheduled_date, status, is_active FROM tblDatafeed
                    `,
          method: 'DATA_FEED',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send DATA_FEED to:' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_DATA_FEED', [])
      })
    }
  })
}

exports.getInstanceInformation = (io, data) => {
  const { userId, archerId, instance } = data

  global.INSTANCE_INFORMATION_INDEX = 0
  global.INSTANCE_INFORMATION = []

  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archerId: ' + archerId)
    console.log(device)
    if (device) {
      for (const dataPoint of global.INSTANCE_DATA_PONITS) {
        const data = {
          status: 200,
          data: {
            query: `
              USE ${instance};
              SELECT data_point, data_point_value FROM tblACRReportData WHERE data_point='${dataPoint}'
            `,
            method: 'INSTANCE_INFORMATION',
            userId: userId,
            type: 0,
            deviceId: device.deviceId
          },
          deviceId: device.deviceId
        }
        console.log('Send INSTANCE_INFORMATION to: ' + device.deviceId)
        io.to(device.socketId).emit('RESPONSE', data)
      }
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_INSTANCE_INFORMATION', [])
      })
    }
  })
}

exports.getApplicationField = (io, data) => {
  const { userId, archerId, instance, page, keyword } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archerId: ' + archerId)
    console.log(device)

    if (device) {
      const startNum = 50 * (page - 1) + 1
      const endNum = 50 * page

      const data = {
        status: 200,
        data: {
          query: `
          USE ${instance};
          SELECT  *
      FROM    ( SELECT    ROW_NUMBER() OVER ( ORDER BY a.module_id ) AS RowNum, a.*, b.field_type_name, c.aso_name
                FROM      viewApplicationFieldList a
                LEFT JOIN tblIVFieldType b ON a.field_type_id=b.field_type_id
                LEFT JOIN tblModule c ON a.module_id=c.module_id
                WHERE (field_id LIKE '${keyword}' OR field_name LIKE '${keyword}' OR [Reports (as display field)] LIKE '${keyword}')
              ) AS RowConstrainedResult
      WHERE   RowNum >= ${startNum}
          AND RowNum <= ${endNum}
      ORDER BY RowNum;
        `,
          method: 'APPLICATION_FIELD',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send APPLICATION_FIELD to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_APPLICATION_FIELD', [])
      })
    }
  })
}

exports.getApplicationFieldCount = (io, data) => {
  const { userId, archerId, instance, page, keyword } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archerId: ' + archerId)
    console.log(device)

    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
        SELECT count(*) as totalCount FROM viewApplicationFieldList
          WHERE (field_id LIKE '${keyword}' OR field_name LIKE '${keyword}' OR [Reports (as display field)] LIKE '${keyword}');
          `,
          method: 'APPLICATION_FIELD_COUNT',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send APPLICATION_FIELD_COUNT to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_APPLICATION_FIELD_COUNT', [])
      })
    }
  })
}

exports.getDatafeedStatistic = (io, data) => {
  const { archerId, userId, startDate, endDate, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    console.log('archerId: ' + archerId)
    console.log(device)

    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance}
            SELECT status_id, start_time, end_time 
            FROM tblDataFeedHistory 
            WHERE CAST(start_time AS date) >= CAST('${
              startDate.split('T')[0]
            }' AS date) AND CAST(end_time AS date) <= CAST('${
            endDate.split('T')[0]
          }' AS date)
          `,
          method: 'DATAFEED_STATISTIC',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log(data.data.query)
      console.log('Send DATAFEED_STATISTIC to: ' + device.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_DATAFEED_STATISTIC', [])
      })
    }
  })
}

exports.getCalculatedField = (io, data) => {
  const { userId, archerId, instance, page } = data
  const startNum = 50 * (page - 1) + 1
  const endNum = 50 * page
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
          USE ${instance};
          SELECT 
              * FROM (SELECT ROW_NUMBER() OVER ( ORDER BY m.module_id ) AS RowNum,
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
                  WHERE 
                fd.level_id = l.level_id
              AND m.module_id = l.module_id
              AND ftype.field_type_id = fd.field_type_id
              AND fd.field_id = c.field_id
              AND ft.language_id = 1
                  ) AS RowConstrainedResult
              where RowNum >= ${startNum}
              and RowNum <= ${endNum}
              ORDER BY RowNum, ModuleName, LevelName, CalcOrder
          `,
          method: 'CALCULATED_FIELD',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send CALCULATED_FIELD to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_CALCULATED_FIELD', [])
      })
    }
  })
}

exports.getCalculatedFieldCount = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT COUNT(*) as count FROM tblIVFieldDef
          `,
          method: 'CALCULATED_FIELD_COUNT',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send CALCULATED_FIELD_COUNT to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_CALCULATED_FIELD_COUNT', 0)
      })
    }
  })
}

exports.getInstanceLoginHeatmap = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
          USE ${instance};
          declare @TAB table (tmpName nvarchar(30),tmpDate datetime)
          declare @TAB1 table ([day] datetime,DW int,NW int,DN char(3)) 
          declare @StartDate date=GETUTCDATE() - 90 
          declare @EndDate datetime=GETUTCDATE() + ' 23:59:59'
          insert @TAB
          SELECT lh.user_id, lh.login_time
          FROM tblLoginHistory AS lh WITH (NOLOCK) JOIN tblUser AS u WITH (NOLOCK) ON u.user_id = lh.user_id
          WHERE lh.login_time BETWEEN @StartDate AND @EndDate AND u.user_type_id IN (1, 3) AND lh.is_impersonated = 0;
          with CTE as ( 
          select @StartDate as [day],DATEPART(DW,@StartDate) as DW,((DATEDIFF(dd,'1899-12-31',@StartDate))/7) as NW,Left(DATENAME(WeekDay,@StartDate),3) as DN
          union all 
          select dateadd(dd,1,[day]),DATEPART(DW,dateadd(dd,1,[day])) as DW,((DATEDIFF(dd,'1899-12-30',[day]))/7) as NW,Left(DATENAME(Weekday,dateadd(dd,1,[day])),3) as DN
          from CTE 
          where [day] < @EndDate)
          insert @TAB1 
          select * from CTE C option (maxrecursion 0)
          ;with CTE1 as (
          select T1.[day],T1.NW,T1.DN,(CASE WHEN T.tmpName is null THEN 0 ELSE 1 END) as ct from @TAB1 T1 
          LEFT JOIN @TAB T on convert(char(10),T.tmpDate,101)=T1.[day]) 
          select NW, convert(char(10),Min([day]),101)+'-'+convert(char(10),MAX([day]),101) as [Week], 
          SUM(CASE WHEN DN='Mon' and ct=1 THEN 1 ELSE 0 END) as Mon,
          SUM(CASE WHEN DN='Tue' and ct=1 THEN 1 ELSE 0 END) as Tue, 
          SUM(CASE WHEN DN='Wed' and ct=1 THEN 1 ELSE 0 END) as Wed, 
          SUM(CASE WHEN DN='Thu' and ct=1 THEN 1 ELSE 0 END) as Thu, 
          SUM(CASE WHEN DN='Fri' and ct=1 THEN 1 ELSE 0 END) as Fri, 
          SUM(CASE WHEN DN='Sat' and ct=1 THEN 1 ELSE 0 END) as Sat, 
          SUM(CASE WHEN DN='Sun' and ct=1 THEN 1 ELSE 0 END) as Sun, 
          SUM(CASE WHEN ct=1 THEN 1 ELSE 0 END) as Weekly 
          from CTE1  
          group by NW 
          order by NW DESC 
          `,
          method: 'INSTANCE_LOGIN_HEATMAP',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send INSTANCE_LOGIN_HEATMAP to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_INSTANCE_LOGIN_HEATMAP', [])
      })
    }
  })
}

exports.getNotificaionDetail = (io, data) => {
  const { userId, archerId, instance, filter } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
          USE ${instance};
          SELECT e.create_date AS CreateDate 
            ,e.email_id AS [Id]
            ,es.email_status_name AS Status
            ,s.subsystem_name AS Type 
            ,t.template_name AS Template
            ,email_subject AS Subject 
            ,u.user_first_name AS RecipientFirstName 
            ,u.user_last_name AS RecipientLastName 
            ,a.email_address AS RecipientEmail 
            ,email_from AS FromAddress 
            ,mt.module_name AS ModuleName 
            ,lt.level_name AS LevelName
            FROM tblNotificationEmail e WITH (NOLOCK)
            JOIN tblNotificationTemplate t WITH (NOLOCK) ON t.notification_template_id = e.notification_template_id 
            JOIN tblSubsystem s WITH (NOLOCK) ON s.subsystem_id = e.subsystem_id 
            JOIN tblNotificationEmailAddressee a WITH (NOLOCK) ON a.email_id = e.email_id 
            JOIN tblNotificationEmailStatus es WITH (NOLOCK) ON es.email_status_id = a.email_status_id 
            LEFT JOIN tblUser u WITH (NOLOCK) ON u.user_id = a.user_id 
            LEFT JOIN dbo.tblLevelTranslation lt WITH(NOLOCK) ON lt.level_id = t.level_id 
            LEFT JOIN dbo.tblLevel l WITH(NOLOCK) ON l.level_id = t.level_id
            LEFT JOIN dbo.tblModuleTranslation mt WITH(NOLOCK) ON mt.module_id = l.module_id
            WHERE e.create_date > GETUTCDATE() - 1
            AND e.email_id LIKE '%${filter.id}%'
            AND es.email_status_name LIKE '%${filter.status}%'
            AND s.subsystem_name LIKE '%${filter.type}%'
            AND t.template_name LIKE '%${filter.template}%'
            AND email_subject LIKE '%${filter.subject}%'
            AND u.user_first_name LIKE '%${filter.firstName}%'
            AND u.user_last_name LIKE '%${filter.lastName}%'
            AND a.email_address LIKE '%${filter.emailTo}%'
            AND email_from LIKE '%${filter.emailFrom}%'
            ORDER BY e.create_date DESC
          `,
          method: 'INSTANCE_NOTIFICATION_DETAIL',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send INSTANCE_NOTIFICATION_DETAIL to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_INSTANCE_NOTIFICATION_DETAIL', [])
      })
    }
  })
}

exports.getRunningJobDetails = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
          USE ${instance};
          WITH XMLNAMESPACES(
            'http://schemas.microsoft.com/2003/10/Serialization/Arrays' AS a ,
            'http://www.w3.org/2001/XMLSchema-instance' AS i  ,
            'http://www.w3.org/2001/XMLSchema' AS x ,
            'http://schemas.microsoft.com/2003/10/Serialization/' AS z ,
            'http://schemas.datacontract.org/2004/07/System.Collections.Generic' AS g ,
            'http://schemas.microsoft.com/2003/10/Serialization/Arrays' AS d7p1 )
            SELECT 
            j.JobId, j.JobType, j.Endpoint AS Server, j.process_id AS ProcessId, j.JobOrder,
            ai.StartTime, ai.EnqueueTime , j.Priority,
            j.EnqueuedDate, j.Generation, j.ParentJobId, j.root_job_id AS RootJobId, j.job_num_id AS JobNumId , 
            mt.module_name AS ModuleName, 
            lt.level_name AS LevelName , 
            df.datafeed_name AS DataFeedName , df2.datafeed_name AS DataFeedName2 , 
            n.template_name AS TemplateName,
            j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[1]/g:key[1])', 'nvarchar(max)') AS KeyName ,
            j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[1]/g:value[1])', 'nvarchar(max)') AS KeyId,
            j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[2]/g:value[1]/KeyValuePairs[1]/*[1]/*[1]/a:_size[1])', 'nvarchar(max)') AS CalcFieldCount,
            j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[2]/g:value[1]/KeyValuePairs[1]/*[1]/*[2]/a:_size[1])', 'nvarchar(max)') AS ContentCount 
            FROM tblAsyncJobQueue j 
            WITH (NOLOCK) LEFT OUTER JOIN tblAsyncInstrumentation ai 
            WITH (NOLOCK) ON ai.JobId = j.JobId LEFT OUTER JOIN tblDataFeed df 
            WITH (NOLOCK) ON df.datafeed_id = j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[1]/g:value[1])', 'nvarchar(max)') LEFT OUTER JOIN tblDataFeedHistory dfh 
            WITH (NOLOCK) ON dfh.datafeed_history_id = j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[1]/g:value[1])', 'nvarchar(max)') LEFT OUTER JOIN tblDataFeed df2 
            WITH (NOLOCK) ON df2.datafeed_id = dfh.datafeed_id LEFT OUTER JOIN tblNotificationTemplate n 
            WITH (NOLOCK) ON n.notification_template_id = j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[1]/g:value[1])', 'nvarchar(max)') LEFT OUTER JOIN tblLevel l 
            WITH (NOLOCK) ON l.level_id = j.named_arguments.value('(/a:ArrayOfKeyValueOfstringanyType[1]/KeyValuePairs[1]/g:KeyValuePairOfstringanyType[1]/g:value[1])', 'nvarchar(max)') LEFT OUTER JOIN tblLevelTranslation lt 
            WITH (NOLOCK) ON lt.level_id = l.level_id LEFT OUTER JOIN tblModuleTranslation mt 
            WITH (NOLOCK) ON mt.module_id = l.module_id
            WHERE Endpoint IS NOT NULL 
            ORDER BY ai.StartTime 
          `,
          method: 'RUNNING_JOB_DETAIL',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send RUNNING_JOB_DETAIL to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_RUNNING_JOB_DETAIL', [])
      })
    }
  })
}

exports.getRunningJobsSummary = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT 
              JobType, COUNT(*) AS Total 
            FROM tblAsyncJobQueue 
            WITH (NOLOCK) WHERE Endpoint IS NOT NULL 
            GROUP BY JobType 
            ORDER BY Total DESC, JobType ASC 
          `,
          method: 'RUNNING_JOB_SUMMARY',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send RUNNING_JOB_SUMMARY to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_RUNNING_JOB_SUMMARY', [])
      })
    }
  })
}

exports.getAvailableJobSummary = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT 
              JobType, 
              COUNT(*) AS Total 
            FROM tblAsyncJobQueue WITH (NOLOCK) 
            WHERE Active = 1 AND [Endpoint] IS NULL 
            GROUP BY JobType 
            ORDER BY Total DESC, JobType ASC
          `,
          method: 'AVAILABLE_JOB_SUMMARY',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send AVAILABLE_JOB_SUMMARY to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_AVAILABLE_JOB_SUMMARY', [])
      })
    }
  })
}

exports.getAllJobSummary = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT 
              JobType, 
              COUNT(*) AS Total 
            FROM tblAsyncJobQueue WITH (NOLOCK) 
            GROUP BY JobType 
            ORDER BY Total DESC, JobType ASC
          `,
          method: 'ALL_JOB_SUMMARY',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send ALL_JOB_SUMMARY to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_ALL_JOB_SUMMARY', [])
      })
    }
  })
}

exports.getJobCompleted = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            declare @TAB table (tmpName nvarchar(30),tmpDate datetime) 
            declare @TAB1 table ([day] datetime,DW int,NW int,DN char(3)) 
            declare @StartDate date=GETUTCDATE() - 15
            declare @EndDate datetime=GETUTCDATE() + ' 23:59:59' 
            insert @TAB 
            SELECT async_instrumentation_id, EndTime
            FROM tblAsyncInstrumentation WITH (NOLOCK)
            WHERE EndTime BETWEEN @StartDate AND @EndDate AND EndTime IS NOT NULL AND Reason = 'Completed'
            ;with CTE as ( 
            select @StartDate as [day],DATEPART(DW,@StartDate) as DW,((DATEDIFF(dd,'1899-12-31',@StartDate))/7) as NW,Left(DATENAME(WeekDay,@StartDate),3) as DN 
            union all 
            select dateadd(dd,1,[day]),DATEPART(DW,dateadd(dd,1,[day])) as DW,((DATEDIFF(dd,'1899-12-30',[day]))/7) as NW,Left(DATENAME(Weekday,dateadd(dd,1,[day])),3) as DN
            from CTE 
            where [day] < @EndDate)  
            insert @TAB1 
            select * from CTE C option (maxrecursion 0) 
            ;with CTE1 as ( 
            select T1.[day],T1.NW,T1.DN,(CASE WHEN T.tmpName is null THEN 0 ELSE 1 END) as ct from @TAB1 T1 
            LEFT JOIN @TAB T on convert(char(10),T.tmpDate,101)=T1.[day]) 
            select NW, convert(char(10),Min([day]),101)+'-'+convert(char(10),MAX([day]),101) as [Week], 
            SUM(CASE WHEN DN='Mon' and ct=1 THEN 1 ELSE 0 END) as Mon, 
            SUM(CASE WHEN DN='Tue' and ct=1 THEN 1 ELSE 0 END) as Tue, 
            SUM(CASE WHEN DN='Wed' and ct=1 THEN 1 ELSE 0 END) as Wed, 
            SUM(CASE WHEN DN='Thu' and ct=1 THEN 1 ELSE 0 END) as Thu,
            SUM(CASE WHEN DN='Fri' and ct=1 THEN 1 ELSE 0 END) as Fri, 
            SUM(CASE WHEN DN='Sat' and ct=1 THEN 1 ELSE 0 END) as Sat, 
            SUM(CASE WHEN DN='Sun' and ct=1 THEN 1 ELSE 0 END) as Sun, 
            SUM(CASE WHEN ct=1 THEN 1 ELSE 0 END) as Weekly 
            from CTE1  
            group by NW 
            order by NW DESC 
          `,
          method: 'JOB_COMPLETED',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send JOB_COMPLETED to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_JOB_COMPLETED', [])
      })
    }
  })
}

exports.getJobFailed = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            declare @TAB table (tmpName nvarchar(30),tmpDate datetime) 
            declare @TAB1 table ([day] datetime,DW int,NW int,DN char(3)) 
            declare @StartDate date=GETUTCDATE() - 15
            declare @EndDate datetime=GETUTCDATE() + ' 23:59:59' 
            insert @TAB 
            SELECT async_instrumentation_id, EndTime
            FROM tblAsyncInstrumentation WITH (NOLOCK)
            WHERE EndTime BETWEEN @StartDate AND @EndDate AND EndTime IS NOT NULL AND Reason != 'Completed'
            ;with CTE as ( 
            select @StartDate as [day],DATEPART(DW,@StartDate) as DW,((DATEDIFF(dd,'1899-12-31',@StartDate))/7) as NW,Left(DATENAME(WeekDay,@StartDate),3) as DN 
            union all 
            select dateadd(dd,1,[day]),DATEPART(DW,dateadd(dd,1,[day])) as DW,((DATEDIFF(dd,'1899-12-30',[day]))/7) as NW,Left(DATENAME(Weekday,dateadd(dd,1,[day])),3) as DN
            from CTE 
            where [day] < @EndDate)  
            insert @TAB1 
            select * from CTE C option (maxrecursion 0) 
            ;with CTE1 as ( 
            select T1.[day],T1.NW,T1.DN,(CASE WHEN T.tmpName is null THEN 0 ELSE 1 END) as ct from @TAB1 T1 
            LEFT JOIN @TAB T on convert(char(10),T.tmpDate,101)=T1.[day]) 
            select NW, convert(char(10),Min([day]),101)+'-'+convert(char(10),MAX([day]),101) as [Week], 
            SUM(CASE WHEN DN='Mon' and ct=1 THEN 1 ELSE 0 END) as Mon, 
            SUM(CASE WHEN DN='Tue' and ct=1 THEN 1 ELSE 0 END) as Tue, 
            SUM(CASE WHEN DN='Wed' and ct=1 THEN 1 ELSE 0 END) as Wed, 
            SUM(CASE WHEN DN='Thu' and ct=1 THEN 1 ELSE 0 END) as Thu,
            SUM(CASE WHEN DN='Fri' and ct=1 THEN 1 ELSE 0 END) as Fri, 
            SUM(CASE WHEN DN='Sat' and ct=1 THEN 1 ELSE 0 END) as Sat, 
            SUM(CASE WHEN DN='Sun' and ct=1 THEN 1 ELSE 0 END) as Sun, 
            SUM(CASE WHEN ct=1 THEN 1 ELSE 0 END) as Weekly 
            from CTE1  
            group by NW 
            order by NW DESC 
          `,
          method: 'JOB_FAILED',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send JOB_FAILED to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_JOB_FAILED', [])
      })
    }
  })
}

exports.getSearchDetail = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT TOP 20 * FROM   (SELECT 'Attachment' AS RecordType,   mt.module_name AS ModuleName,   tblIVContent.content_id AS ContentId,   tblIVContent.create_date AS ContentCreated,   tblIVContent.update_date AS ContentUpdated,   CASE WHEN tblIVContent.update_date<>last_updated THEN 'Calc Engine' ELSE   user_first_name +' '+user_last_name  END   AS LastUpdatedBy,   file_name AS FileName,   tblSearchMessageQueue.create_date AS QueueDate,   tblSearchMessageQueue.priority_type_id AS PriorityId,   priority_name AS [Priority],   tblSearchMessageQueue.message_id AS MessageId,   message_item_id AS MessageItemId,   tblIVContent.sequential_id AS SequentialId  FROM    tblSearchMessageQueue WITH (NOLOCK)    LEFT JOIN tblRepositoryFile  ON tblSearchMessageQueue.message_item_id=tblRepositoryFile.file_id   LEFT JOIN tblXIVContentRepositoryLinks ON tblXIVContentRepositoryLinks.file_id=tblRepositoryFile.file_id   LEFT JOIN tblIVFieldDef ON tblIVFieldDef.field_id=tblXIVContentRepositoryLinks.field_id   LEFT JOIN tblIVContent ON tblXIVContentRepositoryLinks.content_id=tblIVContent.content_id   LEFT JOIN tblLevel l ON l.level_id = tblIVFieldDef.level_id   LEFT JOIN tblModule m ON m.module_id = l.module_id   JOIN dbo.tblLevelTranslation LT ON l.level_id = LT.level_id    JOIN dbo.tblModuleTranslation MT ON m.module_id = mt.module_id    LEFT JOIN tblSearchMessageType ON tblSearchMessageQueue.message_type_id=tblSearchMessageType.search_message_type_id   LEFT JOIN tblSearchMessagePriorityType ON tblSearchMessageQueue.priority_type_id=tblSearchMessagePriorityType.priority_type_id   LEFT JOIN tblSearchMessageContent ON tblSearchMessageContent.message_id=tblSearchMessageQueue.message_id   LEFT JOIN tblUser ON tblIVContent.update_login=tblUser.user_id  WHERE   tblSearchMessageQueue.number_content=0   OR tblSearchMessageQueue.number_content IS null    UNION   SELECT    'Content Record' AS RecordType,   mt2.module_name AS ModuleName,   tblIVContent.content_id AS ContentId,   tblIVContent.create_date AS ContentCreated,   tblIVContent.update_date AS ContentUpdated,   CASE WHEN tblIVContent.update_date<>last_updated THEN 'Calc Engine' ELSE   user_first_name +' '+user_last_name  END   AS LastUpdatedBy,   '' AS FileName,   tblSearchMessageQueue.create_date AS QueueDate,   tblSearchMessageQueue.priority_type_id AS PriorityId,   priority_name AS [Priority],   tblSearchMessageQueue.message_id AS MessageId,   message_item_id AS MessageItemId,   tblIVContent.sequential_id AS SequentialId  FROM    tblSearchMessageQueue WITH (NOLOCK)    LEFT JOIN tblSearchMessageContent ON tblSearchMessageContent.message_id=tblSearchMessageQueue.message_id   LEFT JOIN tblIVContent ON tblSearchMessageContent.content_id=tblIVContent.content_id   LEFT JOIN tblSearchMessageType ON tblSearchMessageQueue.message_type_id=tblSearchMessageType.search_message_type_id   LEFT JOIN tblSearchMessagePriorityType ON tblSearchMessageQueue.priority_type_id=tblSearchMessagePriorityType.priority_type_id   LEFT JOIN tblModule m2 ON tblIVContent.module_id = m2.module_id   JOIN dbo.tblModuleTranslation MT2 ON m2.module_id = mt2.module_id    LEFT JOIN tblUser ON tblIVContent.update_login=tblUser.user_id  WHERE   tblSearchMessageQueue.number_content>0   AND tblSearchMessageQueue.number_content IS NOT null  ) AS data ORDER BY PriorityId, QueueDate
          `,
          method: 'SEARCH_INDEX',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send SEARCH_INDEX to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_SEARCH_INDEX', [])
      })
    }
  })
}

exports.getContentCreated = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            declare @TAB table (tmpName nvarchar(30),tmpDate datetime) 
            declare @TAB1 table ([day] datetime,DW int,NW int,DN char(3)) 
            declare @StartDate date=GETUTCDATE() - 15
            declare @EndDate datetime=GETUTCDATE() + ' 23:59:59' 
            insert @TAB 
            SELECT content_id, create_date
            FROM tblIVContent WITH (NOLOCK)
            WHERE create_date BETWEEN @StartDate AND @EndDate
            ;with CTE as ( 
            select @StartDate as [day],DATEPART(DW,@StartDate) as DW,((DATEDIFF(dd,'1899-12-31',@StartDate))/7) as NW,Left(DATENAME(WeekDay,@StartDate),3) as DN 
            union all 
            select dateadd(dd,1,[day]),DATEPART(DW,dateadd(dd,1,[day])) as DW,((DATEDIFF(dd,'1899-12-30',[day]))/7) as NW,Left(DATENAME(Weekday,dateadd(dd,1,[day])),3) as DN
            from CTE 
            where [day] < @EndDate)  
            insert @TAB1 
            select * from CTE C option (maxrecursion 0) 
            ;with CTE1 as ( 
            select T1.[day],T1.NW,T1.DN,(CASE WHEN T.tmpName is null THEN 0 ELSE 1 END) as ct from @TAB1 T1 
            LEFT JOIN @TAB T on convert(char(10),T.tmpDate,101)=T1.[day]) 
            select NW, convert(char(10),Min([day]),101)+'-'+convert(char(10),MAX([day]),101) as [Week], 
            SUM(CASE WHEN DN='Mon' and ct=1 THEN 1 ELSE 0 END) as Mon, 
            SUM(CASE WHEN DN='Tue' and ct=1 THEN 1 ELSE 0 END) as Tue, 
            SUM(CASE WHEN DN='Wed' and ct=1 THEN 1 ELSE 0 END) as Wed, 
            SUM(CASE WHEN DN='Thu' and ct=1 THEN 1 ELSE 0 END) as Thu,
            SUM(CASE WHEN DN='Fri' and ct=1 THEN 1 ELSE 0 END) as Fri, 
            SUM(CASE WHEN DN='Sat' and ct=1 THEN 1 ELSE 0 END) as Sat, 
            SUM(CASE WHEN DN='Sun' and ct=1 THEN 1 ELSE 0 END) as Sun, 
            SUM(CASE WHEN ct=1 THEN 1 ELSE 0 END) as Weekly 
            from CTE1  
            group by NW 
            order by NW DESC 
          `,
          method: 'CONTENT_CREATED',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send CONTENT_CREATED to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_CONTENT_CREATED', [])
      })
    }
  })
}

exports.getContentUpdated = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            declare @TAB table (tmpName nvarchar(30),tmpDate datetime) 
            declare @TAB1 table ([day] datetime,DW int,NW int,DN char(3)) 
            declare @StartDate date=GETUTCDATE() - 15
            declare @EndDate datetime=GETUTCDATE() + ' 23:59:59' 
            insert @TAB 
            SELECT content_id, update_date
            FROM tblIVContent WITH (NOLOCK)
            WHERE update_date BETWEEN @StartDate AND @EndDate AND create_date <> update_date
            ;with CTE as ( 
            select @StartDate as [day],DATEPART(DW,@StartDate) as DW,((DATEDIFF(dd,'1899-12-31',@StartDate))/7) as NW,Left(DATENAME(WeekDay,@StartDate),3) as DN 
            union all 
            select dateadd(dd,1,[day]),DATEPART(DW,dateadd(dd,1,[day])) as DW,((DATEDIFF(dd,'1899-12-30',[day]))/7) as NW,Left(DATENAME(Weekday,dateadd(dd,1,[day])),3) as DN
            from CTE 
            where [day] < @EndDate)  
            insert @TAB1 
            select * from CTE C option (maxrecursion 0) 
            ;with CTE1 as ( 
            select T1.[day],T1.NW,T1.DN,(CASE WHEN T.tmpName is null THEN 0 ELSE 1 END) as ct from @TAB1 T1 
            LEFT JOIN @TAB T on convert(char(10),T.tmpDate,101)=T1.[day]) 
            select NW, convert(char(10),Min([day]),101)+'-'+convert(char(10),MAX([day]),101) as [Week], 
            SUM(CASE WHEN DN='Mon' and ct=1 THEN 1 ELSE 0 END) as Mon, 
            SUM(CASE WHEN DN='Tue' and ct=1 THEN 1 ELSE 0 END) as Tue, 
            SUM(CASE WHEN DN='Wed' and ct=1 THEN 1 ELSE 0 END) as Wed, 
            SUM(CASE WHEN DN='Thu' and ct=1 THEN 1 ELSE 0 END) as Thu,
            SUM(CASE WHEN DN='Fri' and ct=1 THEN 1 ELSE 0 END) as Fri, 
            SUM(CASE WHEN DN='Sat' and ct=1 THEN 1 ELSE 0 END) as Sat, 
            SUM(CASE WHEN DN='Sun' and ct=1 THEN 1 ELSE 0 END) as Sun, 
            SUM(CASE WHEN ct=1 THEN 1 ELSE 0 END) as Weekly 
            from CTE1  
            group by NW 
            order by NW DESC 
          `,
          method: 'CONTENT_UPDATED',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send CONTENT_UPDATED to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_CONTENT_UPDATED', [])
      })
    }
  })
}

exports.getLdapErrorSummary = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            declare @TAB table (tmpName nvarchar(30),tmpDate datetime) 
            declare @TAB1 table ([day] datetime,DW int,NW int,DN char(3)) 
            declare @StartDate date=GETUTCDATE() - 10
            declare @EndDate datetime=GETUTCDATE() + ' 23:59:59' 
            insert @TAB 
            SELECT error_id, create_date
            FROM tblLDAPErrors WITH (NOLOCK)
            WHERE create_date BETWEEN @StartDate AND @EndDate
            ;with CTE as ( 
            select @StartDate as [day],DATEPART(DW,@StartDate) as DW,((DATEDIFF(dd,'1899-12-31',@StartDate))/7) as NW,Left(DATENAME(WeekDay,@StartDate),3) as DN 
            union all 
            select dateadd(dd,1,[day]),DATEPART(DW,dateadd(dd,1,[day])) as DW,((DATEDIFF(dd,'1899-12-30',[day]))/7) as NW,Left(DATENAME(Weekday,dateadd(dd,1,[day])),3) as DN
            from CTE 
            where [day] < @EndDate)  
            insert @TAB1 
            select * from CTE C option (maxrecursion 0) 
            ;with CTE1 as ( 
            select T1.[day],T1.NW,T1.DN,(CASE WHEN T.tmpName is null THEN 0 ELSE 1 END) as ct from @TAB1 T1 
            LEFT JOIN @TAB T on convert(char(10),T.tmpDate,101)=T1.[day]) 
            select NW, convert(char(10),Min([day]),101)+'-'+convert(char(10),MAX([day]),101) as [Week], 
            SUM(CASE WHEN DN='Mon' and ct=1 THEN 1 ELSE 0 END) as Mon, 
            SUM(CASE WHEN DN='Tue' and ct=1 THEN 1 ELSE 0 END) as Tue, 
            SUM(CASE WHEN DN='Wed' and ct=1 THEN 1 ELSE 0 END) as Wed, 
            SUM(CASE WHEN DN='Thu' and ct=1 THEN 1 ELSE 0 END) as Thu,
            SUM(CASE WHEN DN='Fri' and ct=1 THEN 1 ELSE 0 END) as Fri, 
            SUM(CASE WHEN DN='Sat' and ct=1 THEN 1 ELSE 0 END) as Sat, 
            SUM(CASE WHEN DN='Sun' and ct=1 THEN 1 ELSE 0 END) as Sun, 
            SUM(CASE WHEN ct=1 THEN 1 ELSE 0 END) as Weekly 
            from CTE1  
            group by NW 
            order by NW DESC 
          `,
          method: 'LDAP_ERROR_SUMMARY',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send LDAP_ERROR_SUMMARY to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_LDAP_ERROR_SUMMARY', [])
      })
    }
  })
}

exports.getCalculatedFieldError = (io, data) => {
  const { userId, archerId, instance } = data
  deviceController.getDbDeviceByArcher(archerId, (err, device) => {
    if (device) {
      const data = {
        status: 200,
        data: {
          query: `
            USE ${instance};
            SELECT 
              ced.create_date AS CreateDate, 
              mt.module_name AS ModuleName, 
              lt.level_name AS LevelName, 
              ced.content_id AS ContentId, 
              ced.field_id AS FieldId, 
              ft.field_name AS FieldName, 
              REPLACE(REPLACE(ced.error_msg, CHAR(10), '.'), CHAR(13), '') AS Error, 
              u.user_display_name AS [User] 
            FROM tblIVCalcErrorData ced WITH ( NOLOCK ) 
            JOIN tblIVFieldDef fd WITH ( NOLOCK ) ON fd.field_id = ced.field_id 
            JOIN tblFieldTranslation ft WITH ( NOLOCK ) ON ft.field_id = ced.field_id 
            JOIN tblUser u WITH ( NOLOCK ) ON u.user_id = ced.create_login 
            JOIN tbllevel l WITH ( NOLOCK ) ON fd.level_id = l.level_id 
            JOIN tblModule m WITH ( NOLOCK ) ON m.module_id = l.module_id 
            JOIN tblLevelTranslation LT WITH ( NOLOCK ) ON L.level_id = LT.level_id 
            JOIN tblModuleTranslation MT WITH ( NOLOCK ) ON MT.module_id = m.module_id 
            WHERE ced.create_date > GETUTCDATE() - 10 ORDER BY ced.create_date DESC
          `,
          method: 'CALCULATED_FIELD_ERROR',
          userId: userId,
          type: 0,
          deviceId: device.deviceId
        },
        deviceId: device.deviceId
      }
      console.log('Send CALCULATED_FIELD_ERROR to:' + data.socketId)
      io.to(device.socketId).emit('RESPONSE', data)
    } else {
      usersController.getSocketIdById(userId, (err, userInfo) => {
        io.to(userInfo.socketId).emit('RES_CALCULATED_FIELD_ERROR', [])
      })
    }
  })
}
