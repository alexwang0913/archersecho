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
          "Service Name",
          "Name",
          "Version",
          "Service Type",
          "Start Mode",
          "State",
          "Status",
          "Description",
          "Process Id",
          "Started",
          "File Path"
        ],
        columns: [
          { data: "server", editor: false },
          { data: "service_name", editor: false },
          { data: "name", editor: false },
          { data: "version", editor: false },
          { data: "service_type", editor: false },
          { data: "start_mode", editor: false },
          { data: "state", editor: false },
          { data: "status", editor: false },
          { data: "description", editor: false },
          { data: "process_id", editor: false },
          { data: "started", editor: false },
          { data: "file_path", editor: false }
        ],
        height: 500
      },

      resCount: 0
    };
  },
  mounted() {
    this.getTopFieldHistories();
    this.responseSocket();
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
        sectionName: "Windows Services",
        method: "WINDOWS_SERVICE"
      };
      this.socket.emit("REQ_WINDOWS_SERVICE", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });
      this.socket.on("RES_WINDOWS_SERVICE", response => {
        const count = response.length / 12;
        for (let i = 0; i < count; i++) {
          const idx = i * 12;
          this.settings.data.push({
            server: response[idx]["data_point_value"],
            service_name: response[idx + 1]["data_point_value"],
            name: response[idx + 2]["data_point_value"],
            version: response[idx + 3]["data_point_value"],
            service_type: response[idx + 4]["data_point_value"],
            start_mode: response[idx + 5]["data_point_value"],
            state: response[idx + 6]["data_point_value"],
            status: response[idx + 7]["data_point_value"],
            description: response[idx + 8]["data_point_value"],
            process_id: response[idx + 9]["data_point_value"],
            started: response[idx + 10]["data_point_value"],
            file_path: response[idx + 11]["data_point_value"]
          });
        }

        this.$vs.loading.close("#div-loading > .con-vs-loading");
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