import state from "./moduleDeviceState.js";
import mutations from "./moduleDeviceMutations.js";
import actions from "./moduleDeviceActions";
import getters from "./moduleDeviceGetters";

export default {
  namespaced: true,
  state: state,
  actions: actions,
  mutations: mutations,
  getters: getters
};
