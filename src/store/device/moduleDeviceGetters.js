export default {
  filterDevices(state) {
    return state.devices.filter(device => {
      return (
        device.name.indexOf(state.filter.keyword) > -1 &&
        (state.filter.category === 0
          ? true
          : device.type.indexOf(state.filter.category) > -1)
      );
    });
  }
};
