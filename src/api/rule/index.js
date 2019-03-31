import client from '../client'

const list = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/rule'
  })
  return response.data
}

export default {
  list
}
