<template>
  <div id="div-loading" class="vs-con-loading__container">
    <hot-table :settings="settings"></hot-table>
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

      settings: {
        rowHeights: 23,
        data: [{ path: 1 }],
        colHeaders: [
          "Instance",
          "Server",
          "Database",
          "Database Size",
          "Unalocated Space",
          "IPv4 Address",
          "IPV6 Address",
          "Integrated Security",
          "Username"
        ],
        columns: [
          { data: "instance", editor: false },
          { data: "server", editor: false },
          { data: "database", editor: false },
          { data: "database_size", editor: false },
          { data: "unalocated_space", editor: false },
          { data: "ipv4_address", editor: false },
          { data: "ipv6_address", editor: false },
          { data: "integrated_security", editor: false },
          { data: "username", editor: false }
        ],
        height: 150
      },

      resCount: 0,
      instances: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getTopFieldHistories();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getTopFieldHistories() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      this.settings.data = [];
      this.instances = await archerApi.getInstances(this.archerId);

      for (const instance of this.instances) {
        const data = {
          userId: this.userId,
          archerId: this.archerId,
          sectionName: "Instance DB",
          method: "INSTANCE_DB",
          database: instance.database
        };
        this.socket.emit("REQ_INSTANCE_DB", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_INSTANCE_DB", response => {
        // console.log(response)
        const count = response.length / 9;
        for (let i = 0; i < count; i++) {
          const idx = i * 9;
          this.settings.data.push({
            instance: response[idx]["data_point_value"],
            server: response[idx + 1]["data_point_value"],
            database: response[idx + 2]["data_point_value"],
            database_size: response[idx + 3]["data_point_value"],
            unalocated_space: response[idx + 4]["data_point_value"],
            ipv4_address: response[idx + 5]["data_point_value"],
            ipv6_address: response[idx + 6]["data_point_value"],
            integrated_security: response[idx + 7]["data_point_value"],
            username: response[idx + 8]["data_point_value"]
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