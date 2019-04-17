<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-table :data="dataList">
      <template slot="thead">
        <vs-th>Job Type</vs-th>
        <vs-th>Number of Jobs</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.job_type}}</vs-td>
          <vs-td>{{tr.number_of_jobs}}</vs-td>
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
          sectionName: "Jobs Queued",
          method: "JOB_QUEUED",
          database: instance.database
        };
        this.socket.emit("REQ_JOB_QUEUED", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_JOB_QUEUED", response => {
        // console.log(response)
        const count = response.length / 2;
        for (let i = 0; i < count; i++) {
          const idx = i * 2;
          this.dataList.push({
            job_type: response[idx]["data_point_value"],
            number_of_jobs: response[idx + 1]["data_point_value"]
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