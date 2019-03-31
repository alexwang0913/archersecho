import client from '../client'
const login = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/auth/login',
    data
  })
  return response.data
}

const signUp = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/auth/signup',
    data
  })
  return response.data
}

const tmpLogin = async data => {
  const response = await client({
    method: 'POST',
    url: '/api/auth/tmpLogin',
    data
  })
  return response.data
}

const getAttemptInfo = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/auth/loginAttemptInfo'
  })
  return response.data
}

const getPaneltyRemainTime = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/auth/paneltyRemainTime'
  })
  return response.data
}

const tempLoginOut = async () => {
  const response = await client({
    method: 'GET',
    url: '/api/auth/tempLoginOut'
  })
  return response.data
}

export default {
  login,
  signUp,
  tmpLogin,
  getAttemptInfo,
  getPaneltyRemainTime,
  tempLoginOut
}
