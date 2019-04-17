<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-table :data="dataList">
      <template slot="thead">
        <vs-th># of Concurrent Users</vs-th>
        <vs-th>Date and Time</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.concurrent_users}}</vs-td>
          <vs-td>{{tr.date_time}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";
import archerApi from "../../api/archer";

export default {
  components: { HotTable },
  data() {
    return {
      socket: io(SERVER_URL),
      userId: getFromStorage("user").id,
      archerId: this.$route.params.id,

      dataList: [],
      resCount: 0,
      instances: []
    };
  },
  mounted() {
    this.getData();
    this.responseSocket();
  },
  methods: {
    async getData() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      this.dataList = [];
      this.instances = await archerApi.getInstances(this.archerId);

      for (const instance of this.instances) {
        const data = {
          userId: this.userId,
          archerId: this.archerId,
          sectionName: "Top 5 Concurrent User Peaks for the Last 30 Days",
          method: "CURRENT_USER_PEAK",
          database: instance.database
        };
        this.socket.emit("REQ_CURRENT_USER_PEAK", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_CURRENT_USER_PEAK", response => {
        const count = response.length / 2;
        for (let i = 0; i < count; i++) {
          const idx = i * 2;
          this.dataList.push({
            concurrent_users: response[idx]["data_point_value"],
            date_time: response[idx + 1]["data_point_value"]
          });
        }

        if (++this.resCount === this.instances.length) {
          this.$vs.loading.close("#div-loading > .con-vs-loading");
        }
      });
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
  }
};
</script>

<style lang="scss" scoped>
</style>