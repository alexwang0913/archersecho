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
          "Default Time Zone",
          "Default Locale",
          "Caching Provider",
          "Log Level",
          "Log Path"
        ],
        columns: [
          { data: "default_time_zone", editor: false },
          { data: "default_locale", editor: false },
          { data: "caching_provider", editor: false },
          { data: "log_level", editor: false },
          { data: "log_path", editor: false }
        ]
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
        sectionName: "Installation Report",
        method: "INSTALLATION_RESPORT"
      };
      this.socket.emit("REQ_INSTALLATION_RESPORT", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_INSTALLATION_RESPORT", response => {
        const idx = 0;
        this.settings.data.push({
          default_time_zone: response[idx]["data_point_value"],
          default_locale: response[idx + 1]["data_point_value"],
          caching_provider: response[idx + 2]["data_point_value"],
          log_level: response[idx + 3]["data_point_value"],
          log_path: response[idx + 4]["data_point_value"]
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