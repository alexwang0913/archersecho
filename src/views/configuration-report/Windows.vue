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
          "Server",
          "CPU",
          "# of CPUS",
          "Total Memory(GB)",
          "OS Version",
          "OS Service pack",
          "OS Architecture",
          "Host Name",
          "System Drive",
          "System Drive Free Space",
          "IPv4 Address",
          "IPv6 Address",
          "Time Zone",
          "Manufacture",
          "Model",
          "Install Date"
        ],
        columns: [
          { data: "server", editor: false },
          { data: "cpu", editor: false },
          { data: "cpus", editor: false },
          { data: "total_momory", editor: false },
          { data: "os_version", editor: false },
          { data: "os_service_pack", editor: false },
          { data: "os_architecture", editor: false },
          { data: "host_name", editor: false },
          { data: "system_drive", editor: false },
          { data: "system_drive_free_space", editor: false },
          { data: "ipv4_address", editor: false },
          { data: "ipv6_address", editor: false },
          { data: "time_zone", editor: false },
          { data: "model", editor: false },
          { data: "install_date", editor: false }
        ],
        height: 150
      },

      resCount: 0,
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

      const data = {
        userId: this.userId,
        archerId: this.archerId,
        database: "Configuration",
        sectionName: "Windows",
        method: "WINDOWS"
      };
      this.socket.emit("REQ_WINDOWS", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_WINDOWS", response => {
        const idx = 0;
        this.settings.data.push({
          server: response[idx]["data_point_value"],
          cpu: response[idx + 1]["data_point_value"],
          cpus: response[idx + 2]["data_point_value"],
          total_memory: response[idx + 3]["data_point_value"],
          os_version: response[idx + 4]["data_point_value"],
          os_service_pack: response[idx + 5]["data_point_value"],
          os_architecture: response[idx + 6]["data_point_value"],
          host_name: response[idx + 7]["data_point_value"],
          system_drive: response[idx + 8]["data_point_value"],
          system_drivee_free_space: response[idx + 9]["data_point_value"],
          ipv4_address: response[idx + 10]["data_point_value"],
          ipv6_address: response[idx + 11]["data_point_value"],
          time_zone: response[idx + 12]["data_point_value"],
          model: response[idx + 13]["data_point_value"],
          install_date: response[idx + 14]["data_point_value"]
        });
        this.$vs.loading.close("#div-loading > .con-vs-loading");
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