<template>
  <div id="div-uptime" class="vs-con-loading__container" style="height: 500px">
    <vs-row vs-justify="center" vs-align="center">
      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <vs-select class="selectExample" v-model="device">
          <vs-select-item
            :key="index"
            :value="item._id"
            :text="item.name"
            v-for="(item,index) in devices"
          />
        </vs-select>
      </vs-col>

      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <datepicker style="z-index: 1000;" placeholder="Select Start Date" v-model="startDate"></datepicker>
      </vs-col>

      <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
        <datepicker style="z-index: 1000;" placeholder="Select End Date" v-model="endDate"></datepicker>
      </vs-col>
    </vs-row>
    <vs-row class="mt-4">
      <vs-col vs-offset="9" vs-justify="center" vs-align="center" vs-type="flex" vs-w="3">
        <vs-button type="relief" @click="getData">Get data</vs-button>
      </vs-col>
    </vs-row>

    <vs-table max-items="5" pagination :data="uptimeData" class="mt-4">
      <template slot="thead">
        <vs-th>Date</vs-th>
        <vs-th>Online time</vs-th>
        <vs-th>Offline time</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.date}}</vs-td>
          <vs-td>{{tr.onlineTime}}</vs-td>
          <vs-td>{{tr.offlineTime}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import deviceApi from "../../api/device";
import Datepicker from "vuejs-datepicker";
import { getFromStorage } from "../../utils";
export default {
  components: { Datepicker },
  data() {
    return {
      archerId: getFromStorage("archerId"),

      devices: [],
      device: null,
      startDate: null,
      endDate: null,

      uptimeData: []
    };
  },
  mounted() {
    this.getDevices();
  },
  methods: {
    async getDevices() {
      this.$vs.loading({
        container: "#div-uptime",
        scale: 0.6,
        type: "point"
      });
      this.devices = await deviceApi.getDeviceByArcher(this.archerId);
      this.$vs.loading.close("#div-uptime > .con-vs-loading");
    },
    async getData() {
      this.$vs.loading({
        container: "#div-uptime",
        scale: 0.6,
        type: "point"
      });
      const data = {
        deviceId: this.device,
        startDate: this.startDate,
        endDate: this.endDate
      };
      this.uptimeData = await deviceApi.getUptimeData(data);
      this.$vs.loading.close("#div-uptime > .con-vs-loading");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>