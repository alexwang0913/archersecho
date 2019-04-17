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
        height: 200,
        data: [],
        colHeaders: [
          "Name",
          "Transporter",
          "Active",
          "Status",
          "Start Time",
          "End Time",
          "Elapsed",
          "Manually Started",
          "Next Scheduled Date",
          "Records/sec",
          "Records Processed",
          "Records Created",
          "Records Updated",
          "Records Failed",
          "Child Records Created",
          "Child Records Updated",
          "Child Records Failed",
          "Subforms Created",
          "Subforms Updated",
          "Subforms Failed"
        ],
        columns: [
          { data: "name", editor: false },
          { data: "transporter", editor: false },
          { data: "active", editor: false },
          { data: "status", editor: false },
          { data: "start_time", editor: false },
          { data: "end_time", editor: false },
          { data: "elapsed", editor: false },
          { data: "manually_started", editor: false },
          { data: "next_sheduled_date", editor: false },
          { data: "records_sec", editor: false },
          { data: "records_processed", editor: false },
          { data: "records_created", editor: false },
          { data: "records_updated", editor: false },
          { data: "records_failed", editor: false },
          { data: "child_records_created", editor: false },
          { data: "child_records_updated", editor: false },
          { data: "child_records_failed", editor: false },
          { data: "subforms_created", editor: false },
          { data: "subforms_updated", editor: false },
          { data: "subforms_failed", editor: false }
        ]
      },

      resCount: 0,
      instances: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getDatafeeds();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getDatafeeds() {
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
          sectionName: "Data Feeds",
          method: "ACR_DATA_FEED",
          database: instance.database
        };
        this.socket.emit("REQ_ACR_DATA_FEED", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_ACR_DATA_FEED", response => {
        // console.log("response from DATA_FEEDS");
        // console.log(response);
        const count = response.length / 20;
        for (let i = 0; i < count; i++) {
          const idx = i * 20;
          this.settings.data.push({
            name: response[idx]["data_point_value"],
            transporter: response[idx + 1]["data_point_value"],
            active: response[idx + 2]["data_point_value"],
            status: response[idx + 3]["data_point_value"],
            start_time: response[idx + 4]["data_point_value"],
            end_time: response[idx + 5]["data_point_value"],
            elapsed: response[idx + 6]["data_point_value"],
            manually_started: response[idx + 7]["data_point_value"],
            next_sheduled_date: response[idx + 8]["data_point_value"],
            records_sec: response[idx + 9]["data_point_value"],
            records_processed: response[idx + 10]["data_point_value"],
            records_created: response[idx + 11]["data_point_value"],
            records_updated: response[idx + 12]["data_point_value"],
            records_failed: response[idx + 13]["data_point_value"],
            child_records_created: response[idx + 14]["data_point_value"],
            child_records_updated: response[idx + 15]["data_point_value"],
            child_records_failed: response[idx + 16]["data_point_value"],
            subforms_created: response[idx + 17]["data_point_value"],
            subforms_updated: response[idx + 18]["data_point_value"],
            subforms_failed: response[idx + 19]["data_point_value"]
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