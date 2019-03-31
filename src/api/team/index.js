import client from '../client'

const addTeam = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/team/add',
    data
  })
  return response.data
}

const getTeamList = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/team/getMyTeam/${userId}`
  })
  return response.data
}

const updateTeam = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/team/update',
    data
  })
  return response.data
}

const remove = async teamId => {
  const response = await client({
    method: 'DELETE',
    url: `/api/team/${teamId}`
  })
  return response.data
}

const getJoinTeam = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/team/getJoinTeam/${userId}`
  })
  return response.data
}

const updateMemberStatus = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/team/updateMemberStatus',
    data
  })
  return response.data
}

const removeMember = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/team/removeMember',
    data
  })
  return response.data
}

const getMemberList = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/team/getMembers/${userId}`
  })
  return response.data
}

const updateAllow = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/team/updateAllow',
    data
  })
  return response.data
}

const getHelpDeskMembers = async userId => {
  const response = await client({
    method: 'GET',
    url: `/api/team/helpDeskMembers/${userId}`
  })
  return response.data
}

export default {
  addTeam,
  getTeamList,
  updateTeam,
  remove,
  getJoinTeam,
  updateMemberStatus,
  removeMember,
  getMemberList,
  updateAllow,
  getHelpDeskMembers
}
