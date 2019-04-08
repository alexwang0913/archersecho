import archerApi from "../../api/archer";

export default {
  async getArcherList({ commit }, userId) {
    const archers = await archerApi.list(userId);

    commit("SET_ARCHERS", archers);
  }
};
