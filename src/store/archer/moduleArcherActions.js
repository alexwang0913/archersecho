import archerApi from "../../api/archer";

export default {
  async getArcherList({ commit }, userId) {
    console.log(userId);
    const archers = await archerApi.list(userId);

    commit("SET_ARCHERS", archers);
  }
};
