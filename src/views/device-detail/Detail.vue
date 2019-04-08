<template>
  <div>
    <div class="vx-row">
      <div class="vx-col sm:w-1/2 w-full mb-2">
        <span class="mr-1">Server Status:</span>
        <span
          :class="['text-' + statusColor(data.status), 'font-semibold']"
        >{{statusLabel(data.status)}}</span>
      </div>
      <div class="vx-col sm:w-1/2 w-full mb-2">
        <span class="mr-1">System uptime:</span>
        <span class="font-semibold">{{systemUptime}}</span>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col sm:w-1/2 w-full mb-2">
        <span class="mr-1">Device name:</span>
        <span class="font-semibold">{{data.name}}</span>
      </div>
      <div class="vx-col sm:w-1/2 w-full mb-2">
        <span class="mr-1">Cpu usage:</span>
        <span class="font-semibold">{{cpuUsage}}</span>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col sm:w-1/2 w-full mb-2">
        <span class="mr-1">Device id:</span>
        <span class="font-semibold">{{data.id}}</span>
      </div>
      <div class="vx-col sm:w-1/2 w-full mb-2">
        <span class="mr-1">Memory available:</span>
        <span class="font-semibold">{{memoryAvailable}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getStatusColor, getStatusLabel } from "../../utils/device";
import { getDateFromTime } from "../../utils";
export default {
  props: ["data"],
  mounted() {},
  methods: {
    statusColor(status) {
      return getStatusColor(status);
    },
    statusLabel(status) {
      return getStatusLabel(status);
    }
  },
  computed: {
    systemUptime() {
      return getDateFromTime(this.data.uptime);
    },
    cpuUsage() {
      return this.data.cpuUsage ? this.data.cpuUsage.toFixed(1) : "";
    },
    memoryAvailable() {
      return this.data.memoryAvailable
        ? this.data.memoryAvailable.toFixed(2)
        : "";
    }
  }
};
</script>

<style scoped>
</style>