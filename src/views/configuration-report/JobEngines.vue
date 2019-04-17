<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-table :data="dataList">
      <template slot="thead">
        <vs-th>Instance</vs-th>
        <vs-th>Server</vs-th>
        <vs-th>Job Count</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.instance}}</vs-td>
          <vs-td>{{tr.server}}</vs-td>
          <vs-td>{{tr.job_count}}</vs-td>
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
      instances: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getData();
    this.responseSocket();
    this.checkResponse();
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
          sectionName: "Job Engines",
          method: "JOB_ENGINE",
          database: instance.database
        };
        this.socket.emit("REQ_JOB_ENGINE", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_JOB_ENGINE", response => {
        const count = response.length / 3;
        for (let i = 0; i < count; i++) {
          const idx = i * 3;
          this.dataList.push({
            instance: response[idx]["data_point_value"],
            server: response[idx + 1]["data_point_value"],
            job_count: response[idx + 2]["data_point_value"]
          });
        }

        if (++this.resCount === this.instances.length) {
          this.$vs.loading.close("#div-loading > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      this.timer = setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-loading > .con-vs-loading");
          vm.$vs.notify({
            color: "warning",
            title: "Warning",
            text: "No response from server."
          });
        }
      }, 1000 * 10);
    }
  },
  beforeDestroy() {
    this.socket.disconnect();
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
</style>