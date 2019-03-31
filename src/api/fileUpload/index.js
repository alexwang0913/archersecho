import client from '../client'

const list = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/file_uploads'
  })
  return response.data
}

export default {
  list
}
