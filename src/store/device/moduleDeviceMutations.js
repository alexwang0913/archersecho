export default {
  SET_DEVICE_LIST(state, deviceList) {
    state.devices = deviceList;
  },
  SET_FILTER_KEYWORD(state, keyword) {
    state.filter.keyword = keyword;
  },
  SET_FILTER_CATEGORY(state, category) {
    state.filter.category = category;
  },
  SET_PROCESS_LIST(state, processList) {
    state.processList = processList;
  }
};
