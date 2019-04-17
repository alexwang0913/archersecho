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
        height: 500,
        data: [{ name: 1 }],
        rowHeaders: true,
        colHeaders: [
          "Name",
          "Module Name",
          "Field Name",
          "Item Count",
          "Select Type",
          "ASO Status",
          "Values",
          "Default Value",
          "Default Text",
          "Correct Values",
          "Other Text Enabled"
        ],
        columns: [
          { data: "name", editor: false },
          { data: "module_name", editor: false },
          { data: "field_name", editor: false },
          { data: "item_count", editor: false },
          { data: "select_type", editor: false },
          { data: "aso_status", editor: false },
          { data: "values", editor: false },
          { data: "default_value", editor: false },
          { data: "default_text", editor: false },
          { data: "correct_values", editor: false },
          { data: "other_text_enabled", editor: false }
        ],
        className: "htCenter"
      },

      resCount: 0,
      instances: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getValuesList();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getValuesList() {
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
          sectionName: "Values Lists",
          method: "VALUES_LIST",
          database: instance.database
        };
        this.socket.emit("REQ_VALUE_LIST", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_VALUES_LIST", response => {
        const count = response.length / 11;
        for (let i = 0; i < count; i++) {
          const idx = i * 11;
          this.settings.data.push({
            name: response[idx]["data_point_value"],
            module_name: response[idx + 1]["data_point_value"],
            field_name: response[idx + 2]["data_point_value"],
            item_count: response[idx + 3]["data_point_value"],
            select_type: response[idx + 4]["data_point_value"],
            aso_status: response[idx + 5]["data_point_value"],
            values: response[idx + 6]["data_point_value"],
            default_value: response[idx + 7]["data_point_value"],
            default_text: response[idx + 8]["data_point_value"],
            correct_values: response[idx + 9]["data_point_value"],
            other_text_enabled: response[idx + 10]["data_point_value"]
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