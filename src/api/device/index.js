import client from "../client";

const addDevice = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device",
    data
  });
  return response.data;
};

const getDeviceList = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/device/${userId}`
  });
  return response.data;
};

const getDeviceInfo = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/info/${deviceId}`
  });
  return response.data;
};

const addProcess = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/addProcess",
    data
  });
  return response.data;
};

const getProcessList = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/getProcess/${deviceId}`
  });
  return response.data;
};

const deleteProcess = async data => {
  const response = await client({
    method: "DELETE",
    url: "/api/device/process",
    data
  });
  return response.data;
};

const deleteDevice = async deviceId => {
  const response = await client({
    method: "DELETE",
    url: `/api/device/${deviceId}`
  });
  return response.data;
};

const update = async (deviceId, data) => {
  const response = await client({
    method: "PUT",
    url: `/api/device/${deviceId}`,
    data
  });
  return response.data;
};

const updateProcessStatus = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/activeProcess",
    data
  });
  return response.data;
};

const updateName = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/updateName",
    data
  });
  return response.data;
};

const updateProcess = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/updateProcess",
    data
  });
  return response.data;
};

const getDbConfiguration = async data => {
  const response = await client({
    method: "POST",
    url: `/api/device/dbConfiguration`,
    data
  });
  return response.data;
};

const getErrorList = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/errors/${deviceId}`
  });
  return response.data;
};

const getArcherList = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/device/archerList/${userId}`
  });
  return response.data;
};

const getArcherVersion = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/currentArcherVersion/${deviceId}`
  });
  return response.data;
};

const generateSupportTicket = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/generateSupportTicket/${deviceId}`
  });
  return response.data;
};

const downloadErrorList = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/downloadError/${deviceId}`
  });
  return response.data;
};

const getCpuMemoryUtilizationData = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/cpuMemoryUtilization/${deviceId}`
  });
  return response.data;
};

const getInstanceInformation = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/instanceInformation/${deviceId}`
  });
  return response.data;
};

const searchError = async data => {
  const response = await client({
    method: "POST",
    url: `/api/device/searchError`,
    data
  });
  return response.data;
};

const getApplicationFields = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/getApplicationFields/${deviceId}`
  });
  return response.data;
};

const getUptimeData = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/getUptimeData",
    data
  });
  return response.data;
};

const getDatafeedStatistic = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/getDatafeedStatistic",
    data
  });
  return response.data;
};

const getDeviceByArcher = async archerId => {
  const response = await client({
    method: "GET",
    url: `/api/device/getByArcherId/${archerId}`
  });
  return response.data;
};

const verifyUser = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/verifyUser",
    data
  });
  return response.data;
};

const getIisLogInfo = async userId => {
  const response = await client({
    method: "GET",
    url: `/api/dashboard/iisLogs/${userId}`
  });
  return response.data;
};

const updateDetail = async data => {
  const response = await client({
    method: "POST",
    url: "/api/device/updateDetail",
    data
  });
  return response.data;
};

const getEventLogs = async deviceId => {
  const response = await client({
    method: "GET",
    url: `/api/device/getEventLogs/${deviceId}`
  });
  return response.data;
};

export default {
  addDevice,
  getDeviceList,
  getDeviceInfo,
  addProcess,
  getProcessList,
  deleteProcess,
  deleteDevice,
  update,
  updateProcessStatus,
  updateName,
  updateProcess,
  getDbConfiguration,
  getErrorList,
  getArcherList,
  getArcherVersion,
  generateSupportTicket,
  downloadErrorList,
  getCpuMemoryUtilizationData,
  getInstanceInformation,
  searchError,
  getApplicationFields,
  getUptimeData,
  getDatafeedStatistic,
  getDeviceByArcher,
  verifyUser,
  getIisLogInfo,
  updateDetail,
  getEventLogs
};
