<template>
  <div class="px-8 py-4 list-item-component">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-5/6 flex sm:items-center sm:flex-row flex-col">
        <div class="flex items-center">
          <vs-chip :color="statusColor(device.status)">{{statusLabel(device.status)}}</vs-chip>
          <h6>{{device.name}}</h6>
        </div>
        <div class="todo-tags sm:ml-2 sm:my-0 my-2 flex">
          <vs-chip v-for="(category, index) in categories" :key="index">
            <div class="h-2 w-2 rounded-full mr-1" :class="'bg-' + getCategoryColor(category)"></div>
            <span>{{getCategoryLabel(category)}}</span>
          </vs-chip>
        </div>
      </div>

      <div class="vx-col w-full sm:w-1/6 ml-auto flex sm:justify-end">
        <feather-icon
          icon="InfoIcon"
          class="cursor-pointer"
          svgClasses="w-5 h-5 mr-4"
          @click="gotoDeviceDetail"
        ></feather-icon>
        <feather-icon
          icon="TrashIcon"
          class="cursor-pointer"
          svgClasses="w-5 h-5 mr-4"
          @click="confirmDialog"
        ></feather-icon>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full">
        <p class="mt-2 truncate">{{ device._id }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import deviceApi from "../../api/device";
import { getStatusColor, getStatusLabel } from "../../utils/device";
export default {
  props: ["device", "archerId"],
  computed: {
    categories() {
      return this.device.type.split(",");
    }
  },
  mounted() {
    // console.log(this.device);
  },
  methods: {
    getCategoryColor(category) {
      category = parseInt(category);
      if (category === 1) {
        return "primary";
      } else if (category === 2) {
        return "success";
      } else if (category === 3) {
        return "warning";
      }
      return "danger";
    },
    getCategoryLabel(category) {
      category = parseInt(category);
      if (category === 1) {
        return "WebServer";
      } else if (category === 2) {
        return "Services Server";
      } else if (category === 3) {
        return "Database Server";
      }
      return "Other";
    },
    gotoDeviceDetail() {
      this.$router.push({
        path: `/device-detail/${this.device._id}`
      });
    },
    confirmDialog() {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this device?",
        accept: this.deleteDevice
      });
    },
    async deleteDevice() {
      await deviceApi.deleteDevice(this.device._id);
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in remove device"
      });
      this.$store.dispatch("device/getDevicesByArcherId", this.archerId);
    },
    statusColor(status) {
      return getStatusColor(status);
    },
    statusLabel(status) {
      return getStatusLabel(status);
    }
  }
};
</script>

<style scoped>
</style>