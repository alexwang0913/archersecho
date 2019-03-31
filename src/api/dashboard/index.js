import client from '../client'

const getOverallData = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/dashboard/overalldata/${userId}`
  })
  return response.data
}

const getDatafeedStatus = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/dashboard/datafeed_history/${userId}`
  })
  return response.data
}

const getErrorListLast24hours = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/dashboard/error_list/${userId}`
  })
  return response.data
}

const getServicesServerCount = async userId => {
  const response = await client({
    method: 'Get',
    url: `/api/dashboard/servicesServerCount/${userId}`
  })
  return response.data
}

const getDatabaseCount = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/dashboard/databaseCount/${userId}`
  })
  return response.data
}

const getArcherCount = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/dashboard/archerCount/${userId}`
  })
  return response.data
}

const getWebServerCount = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/dashboard/webServerCount/${userId}`
  })
  return response.data
}

export default {
  getOverallData,
  getDatafeedStatus,
  getErrorListLast24hours,
  getServicesServerCount,
  getDatabaseCount,
  getArcherCount,
  getWebServerCount
}
