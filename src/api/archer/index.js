import client from "../client";

const add = async data => {
  const response = await client({
    method: "POST",
    url: "/api/archer/add",
    data
  });
  return response.data;
};

const list = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/list/${userId}`
  });
  return response.data;
};

const addInstance = async data => {
  const response = await client({
    method: "POST",
    url: "/api/archer/addInstance",
    data
  });
  return response.data;
};

const getDbInfo = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/dbInfo/${archerId}`
  });
  return response.data;
};

const updateDbInfo = async (archerId, data) => {
  const response = await client({
    method: "PUT",
    url: `/api/archer/updateDbInfo/${archerId}`,
    data
  });
  return response.data;
};

const getErrorLogs = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/getErrorLogs/${archerId}`
  });
  return response.data;
};

const getInstances = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/getInstances/${archerId}`
  });
  return response.data;
};

const getAverageData = async data => {
  const response = await client({
    method: "POST",
    url: "/api/archer/getAverageData",
    data
  });
  return response.data;
};

const generateSupportTicket = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/generateSupportTicket/${archerId}`
  });
  return response.data;
};

const getSupportTickets = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/getSupportTickets/${archerId}`
  });
  return response.data;
};

const getArcherInfo = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/${archerId}`
  });
  return response.data;
};

const updateArcher = async data => {
  const response = await client({
    method: "POST",
    url: "/api/archer/updateArcher",
    data
  });
  return response.data;
};

const removeArcher = async archerId => {
  const response = await client({
    method: "DELETE",
    url: `/api/archer/${archerId}`
  });
  return response.data;
};

const removeInstance = async data => {
  const response = await client({
    method: "POST",
    url: "/api/archer/removeInstance",
    data
  });
  return response.data;
};

const getDbConfiguration = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/archer/getDbConfiguration/${archerId}`
  });
  return response.data;
};

const updateInstance = async data => {
  const response = await client({
    method: "POST",
    url: "/api/archer/updateInstance",
    data
  });
  return response.data;
};

export default {
  add,
  list,
  addInstance,
  getDbInfo,
  updateDbInfo,
  getErrorLogs,
  getInstances,
  getAverageData,
  generateSupportTicket,
  getSupportTickets,
  getArcherInfo,
  updateArcher,
  removeArcher,
  removeInstance,
  getDbConfiguration,
  updateInstance
};
