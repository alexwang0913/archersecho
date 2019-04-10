import axios from "axios";

// axios.defaults.baseURL = "http://archersecho.com";
axios.defaults.baseURL = "http://localhost:3000";

axios.defaults.headers.post["Content-Type"] = "application/json";

const client = async params => {
  return axios({
    method: params.method,
    url: params.url,
    data: typeof params.data !== "undefined" ? params.data : {},
    params: typeof params.params !== "undefined" ? params.params : {}
  });
};

export default client;
