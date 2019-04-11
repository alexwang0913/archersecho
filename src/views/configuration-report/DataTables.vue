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
          "Table",
          "# of Rows",
          "Size",
          "Total DB Size",
          "Instance Name"
        ],
        columns: [
          { data: "table", editor: false },
          { data: "rows", editor: false },
          { data: "size", editor: false },
          { data: "total_db_size", editor: false },
          { data: "instance_name", editor: false }
        ],
        rowHeaders: true,
        height: 500
      },

      resCount: 0,
      instances: []
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
      this.instances = await archerApi.getInstances(this.archerId);

      for (const instance of this.instances) {
        const data = {
          userId: this.userId,
          archerId: this.archerId,
          sectionName: "DB Tables",
          method: "DB_TABLES",
          database: instance.database
        };
        this.socket.emit("REQ_DB_TABLES", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_DB_TABLES", response => {
        const count = response.length / 5;
        for (let i = 0; i < count; i++) {
          const idx = i * 5;
          this.settings.data.push({
            table: response[idx]["data_point_value"],
            rows: response[idx + 1]["data_point_value"],
            size: response[idx + 2]["data_point_value"],
            total_db_size: response[idx + 3]["data_point_value"],
            instance_name: response[idx + 4]["data_point_value"]
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