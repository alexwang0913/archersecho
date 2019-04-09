import deviceApi from "../../api/device";

export default {
  async getDevicesByArcherId({ commit }, archerId) {
    const devices = await deviceApi.getDeviceByArcher(archerId);
    commit("SET_DEVICE_LIST", devices);
  },
  async getProcessList({ commit }, deviceId) {
    const { process } = await deviceApi.getProcessList(deviceId);

    commit("SET_PROCESS_LIST", process);
  }
};
