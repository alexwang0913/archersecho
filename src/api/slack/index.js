import client from '../client'

const send = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/slack/send',
    data
  })
  return response.data
}

export default {
  send
}
