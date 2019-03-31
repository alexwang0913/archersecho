import client from '../client'

const getList = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/instance/'
  })
  return response.data
}

const getDataFeeds = async data => {
  const response = await client({
    method: 'POST',
    url: `/api/instance/dataFeeds`,
    data
  })
  return response.data
}

const getDataFeedHistory = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/instance/dataFeedHistory',
    data
  })
  return response.data
}

const getInformation = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/instance/getInformation',
    data
  })
  return response.data
}

const getApplicationFieldsBySearch = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/instance/getApplicationFieldsBySearch',
    data
  })
  return response.data
}

export default {
  getList,
  getDataFeeds,
  getDataFeedHistory,
  getInformation,
  getApplicationFieldsBySearch
}
