<template>
  <div id="div-loading" class="vs-con-loading__container">
    <vs-table max-items="10" pagination :data="solutionList">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Application Count</vs-th>
        <vs-th>Create Date</vs-th>
        <vs-th>Is System</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.name}}</vs-td>
          <vs-td>{{tr.application_count}}</vs-td>
          <vs-td>{{tr.create_date}}</vs-td>
          <vs-td>{{tr.is_system}}</vs-td>
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
      solutionList: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getSolutionList();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getSolutionList() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      this.solutionList = [];
      this.instances = await archerApi.getInstances(this.archerId);

      for (const instance of this.instances) {
        const data = {
          userId: this.userId,
          archerId: this.archerId,
          database: instance.database,
          sectionName: "Solutions",
          method: "SOLUTIONS"
        };
        this.socket.emit("REQ_SOLUTIONS", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_SOLUTIONS", response => {
        console.log("response from SOLUTIONS");
        console.log(response);
        const appCount = response.length / 4;
        for (let i = 0; i < appCount; i++) {
          const idx = i * 4;
          this.solutionList.push({
            name: response[idx]["data_point_value"],
            application_count: response[idx + 1]["data_point_value"],
            create_date: response[idx + 2]["data_point_value"],
            is_system: response[idx + 3]["data_point_value"]
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