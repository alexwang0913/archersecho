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
        data: [],
        colHeaders: [
          "Server",
          "Version",
          "Edition",
          "Release",
          "Start Time",
          "#Of Connections",
          "Max Degree Of Parallelism",
          "TempDB Files Count",
          "TempDB File Size",
          "TempDB Growth Rate"
        ],
        columns: [
          { data: "server", editor: false },
          { data: "version", editor: false },
          { data: "edition", editor: false },
          { data: "release", editor: false },
          { data: "start_time", editor: false },
          { data: "connections", editor: false },
          { data: "max_degree", editor: false },
          { data: "temp_file_count", editor: false },
          { data: "temp_file_size", editor: false },
          { data: "temp_growth_rate", editor: false }
        ],
        height: 150,
        rowHeaders: true
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
        sectionName: "SQL Server",
        method: "SQL_SERVER"
      };
      this.socket.emit("REQ_SQL_SERVER", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_SQL_SERVER", response => {
        const idx = 0;
        this.settings.data.push({
          server: response[idx]["data_point_value"],
          version: response[idx + 1]["data_point_value"],
          edition: response[idx + 2]["data_point_value"],
          release: response[idx + 3]["data_point_value"],
          start_time: response[idx + 4]["data_point_value"],
          connection: response[idx + 5]["data_point_value"],
          max_degree: response[idx + 6]["data_point_value"],
          temp_file_count: response[idx + 7]["data_point_value"],
          temp_file_size: response[idx + 8]["data_point_value"],
          temp_growth_rate: response[idx + 9]["data_point_value"]
        });

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