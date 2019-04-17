<template>
  <div id="div-reports" class="vs-con-loading__container">
    <vs-table :data="reports">
      <template slot="thead">
        <vs-th>Report Id</vs-th>
        <vs-th>Report Description</vs-th>
        <vs-th>Created At</vs-th>
        <vs-th>Version</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.report_id}}</vs-td>

          <vs-td>{{tr.report_desc}}</vs-td>

          <vs-td>{{tr.create_date.replace("T", " ")}}</vs-td>

          <vs-td>{{tr.report_version}}</vs-td>
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
      reports: [],
      instances: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    // console.log(this.archerId);
    this.getData();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getData() {
      this.$vs.loading({
        container: "#div-reports",
        scale: 0.6
      });
      this.instances = await archerApi.getInstances(this.archerId);

      for (const instance of this.instances) {
        const data = {
          userId: this.userId,
          archerId: this.archerId,
          instance: instance.database
        };
        // console.log(data);
        this.socket.emit("REQ_ACR", data);
      }
      // for Configuration DB
      const data = {
        userId: this.userId,
        archerId: this.archerId,
        instance: "Configuration"
      };
      // console.log(data);
      this.reports = [];
      this.socket.emit("REQ_ACR", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_ACR", response => {
        // console.log("response from Reports");
        // console.log(response);
        for (const data of response) {
          this.reports.push(data);
        }
        if (++this.resCount === this.instances.length + 1) {
          this.$vs.loading.close("#div-reports > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-reports > .con-vs-loading");
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