import deviceApi from "../../api/device";

export default {
  async getDevicesByArcherId({ commit }, archerId) {
    const devices = await deviceApi.getDeviceByArcher(archerId);
    commit("SET_DEVICE_LIST", devices);
  }
};
