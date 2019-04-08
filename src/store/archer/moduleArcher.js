import state from "./moduleArcherState.js";
import mutations from "./moduleArcherMutations.js";
import actions from "./moduleArcherActions.js";
import getters from "./moduleArcherGetters.js";

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
};
