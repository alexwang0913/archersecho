import axios from "axios";
import { SERVER_URL } from "../utils/constant";

axios.defaults.baseURL = SERVER_URL;

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
