const getStatusColor = status => {
  status = parseInt(status);
  if (status === 0) {
    return "success";
  } else if (status === 1) {
    return "danger";
  } else if (status === 2) {
    return "black";
  }
  return "warning";
};

const getStatusLabel = status => {
  status = parseInt(status);
  if (status === 0) {
    return "Online";
  } else if (status === 1) {
    return "Offline";
  } else if (status === 2) {
    return "Never";
  }
  return "Process not running";
};

export { getStatusColor, getStatusLabel };
