<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-table :data="historyList">
      <template slot="thead">
        <vs-th>Instance</vs-th>
        <vs-th>Application Version</vs-th>
        <vs-th>Installation Date</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.instance}}</vs-td>
          <vs-td>{{tr.application_version}}</vs-td>
          <vs-td>{{tr.installation_date}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";
import archerApi from "../../api/archer";

export default {
  data() {
    return {
      socket: io(SERVER_URL),
      archerId: this.$route.params.id,
      userId: getFromStorage("user").id,
      resCount: 0,
      instances: [],
      historyList: []
    };
  },
  mounted() {
    this.getInstallationHistory();
    this.responseSocket();
  },
  methods: {
    async getInstallationHistory() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      this.historyList = [];
      this.instances = await archerApi.getInstances(this.archerId);
      for (const instance of this.instances) {
        const data = {
          userId: this.userId,
          archerId: this.archerId,
          instance: instance.database
        };
        // console.log(data)
        this.socket.emit("REQ_INSTALLATION_HISTORY", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_INSTALLATION_HISTORY", response => {
        // console.log("response from InstallationHistory");
        // console.log(response);
        for (const data of response) {
          this.historyList.push({
            instance: this.instances[this.resCount].name,
            application_version: data.application_version,
            installation_date: data.create_date.replace("T", " ").split(".")[0]
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