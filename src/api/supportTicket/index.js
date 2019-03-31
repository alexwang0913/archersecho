import client from '../client'

const getList = async deviceId => {
  const response = await client({
    method: 'GET',
    url: `/api/device/supportTicketList/${deviceId}`
  })
  return response.data
}

const update = async (ticketId, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/ticket/${ticketId}`,
    data
  })
  return response.data
}

const deleteTicket = async ticketId => {
  const response = await client({
    method: 'DELETE',
    url: `/api/ticket/${ticketId}`
  })
  return response.data
}

export default {
  getList,
  update,
  deleteTicket
}
