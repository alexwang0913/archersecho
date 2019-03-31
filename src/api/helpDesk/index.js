import client from '../client'
const add = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/helpDesk',
    data
  })
  return response.data
}

const validateUser = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/helpDesk/validateUser/${userId}`
  })
  return response.data
}

const getMyHelpDeskTickets = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/helpDesk/myTickets/${userId}`
  })
  return response.data
}

const getInfo = async id => {
  const response = await client({
    method: 'GET',
    url: `/api/helpDesk/${id}`
  })
  return response.data
}

const update = async (id, data) => {
  const response = await client({
    method: 'PUT',
    url: `/api/helpDesk/${id}`,
    data
  })
  return response.data
}

const closeTicket = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/helpDesk/close',
    data
  })
  return response.data
}

const removeTicket = async id => {
  const response = await client({
    method: 'DELETE',
    url: `/api/helpDesk/${id}`
  })
  return response.data
}

const requestHelpDesk = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/helpDesk/requestTickets/${userId}`
  })
  return response.data
}

export default {
  add,
  validateUser,
  getMyHelpDeskTickets,
  getInfo,
  update,
  closeTicket,
  removeTicket,
  requestHelpDesk
}
