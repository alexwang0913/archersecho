<template>
  <div id="div-device" class="vs-con-loading__container">
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <div class="vx-row">
      <cpu-utilization></cpu-utilization>
      <memory-utilization></memory-utilization>
    </div>
    <detail :data="detail"></detail>
    <driver-information :drives="drives"></driver-information>
    <network-status :networks="networks"></network-status>
    <process-information :id="id"></process-information>
    <vulnerability></vulnerability>
    <windows-event-log :id="id"></windows-event-log>
  </div>
</template>

<script>
import CpuUtilization from "./CpuUtilization.vue";
import MemoryUtilization from "./MemoryUtilization.vue";
import Detail from "./Detail.vue";
import DriverInformation from "./DriverInformation.vue";
import NetworkStatus from "./NetworkStatus.vue";
import ProcessInformation from "./process-information/Index.vue";
import Vulnerability from "./Vulnerability";
import WindowsEventLog from "./WindowsEventLog";

import deviceApi from "../../api/device";
import { setInterval, clearTimeout } from "timers";

export default {
  components: {
    CpuUtilization,
    MemoryUtilization,
    Detail,
    DriverInformation,
    NetworkStatus,
    ProcessInformation,
    Vulnerability,
    WindowsEventLog
  },
  data() {
    return {
      id: this.$route.params.id,

      detail: {},
      drives: [],
      networks: [],

      timer: null
    };
  },
  mounted() {
    this.getInformation();
    this.timer = setInterval(() => {
      this.getInformation();
    }, 1000 * 60 * 10);
  },
  methods: {
    async getInformation() {
      this.$vs.loading({
        container: "#div-device",
        scale: 0.6
      });
      const data = await deviceApi.getDeviceInfo(this.id);
      this.detail = {
        status: data.status,
        name: data.name,
        id: data.id,
        uptime: data.cpu.Uptime,
        cpuUsage: data.cpu.Usage,
        memoryAvailable: data.memory.Available
      };
      this.drives = data.drives;
      this.networks = data.network;

      this.$vs.loading.close("#div-device > .con-vs-loading");
      // console.log(data);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>

<style scoped>
</style>