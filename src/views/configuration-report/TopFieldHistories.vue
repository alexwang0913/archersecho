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
        height: 500,
        rowHeights: 23,
        data: [{ field_name: 1 }],
        colHeaders: [
          "Field Name",
          "Field Id",
          "Field Type",
          "History Size",
          "Row Count",
          "Module Name",
          "Level Name"
        ],
        columns: [
          { data: "field_name", editor: false },
          { data: "field_id", editor: false },
          { data: "field_type", editor: false },
          { data: "history_size", editor: false },
          { data: "row_count", editor: false },
          { data: "module_name", editor: false },
          { data: "level_name", editor: false }
        ],
        className: "htCenter",
        rowHeaders: true
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
          sectionName: "Top 10 Field Histories",
          method: "TOP_FIELDS",
          database: instance.database
        };
        this.socket.emit("REQ_TOP_FIELD", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_TOP_FIELD", response => {
        console.log("response from RES_TOP_FIELD");
        console.log(response);
        const count = response.length / 7;
        for (let i = 0; i < count; i++) {
          const idx = i * 7;
          this.settings.data.push({
            field_name: response[idx]["data_point_value"],
            field_id: response[idx + 1]["data_point_value"],
            field_type: response[idx + 2]["data_point_value"],
            history_size: response[idx + 3]["data_point_value"],
            row_count: response[idx + 4]["data_point_value"],
            module_name: response[idx + 5]["data_point_value"],
            level_name: response[idx + 6]["data_point_value"]
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