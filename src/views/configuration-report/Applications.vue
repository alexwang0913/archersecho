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
        data: [],
        height: 500,
        colHeaders: [
          "Name",
          "Guid",
          "Type",
          "Record Count",
          "Status",
          "Create Date",
          "Update Date",
          "Latest Record Date",
          "Workflow Builder Enabled",
          "Notifications Enabled",
          "Application Owners",
          "Solutions",
          "License End Date",
          "# of DataDriven Events",
          "# of Record Permission Fields",
          "# of Cross Reference Fields",
          "Module ID",
          "Is System",
          "Is Deleted",
          "Is Decrypted",
          "Keep Licensed",
          "Is Licensed Object"
        ],
        columns: [
          { data: "name", editor: false },
          { data: "guid", editor: false },
          { data: "type", editor: false },
          { data: "record_count", editor: false },
          { data: "status", editor: false },
          { data: "create_date", editor: false },
          { data: "update_date", editor: false },
          { data: "latest_record_date", editor: false },
          { data: "workflow_builder_enabled", editor: false },
          { data: "notifications_enabled", editor: false },
          { data: "application_owners", editor: false },
          { data: "solutions", editor: false },
          { data: "license_end_date", editor: false },
          { data: "datadriven_events", editor: false },
          { data: "record_permission_fields", editor: false },
          { data: "cross_reference_fields", editor: false },
          { data: "module_id", editor: false },
          { data: "is_system", editor: false },
          { data: "is_deleted", editor: false },
          { data: "is_decrypted", editor: false },
          { data: "keep_licensed", editor: false },
          { data: "is_licensed_object", editor: false }
        ]
      },

      resCount: 0,
      instances: [],
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getApplications();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getApplications() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      this.settings.data = [];
      this.instances = await archerApi.getInstances(this.archerId);

      for (const instance of this.instances) {
        const data = {
          archerId: this.archerId,
          userId: this.userId,
          sectionName: "Applications",
          database: instance.database,
          method: "APPLICATIONS"
        };
        // console.log(data)
        this.socket.emit("REQ_APPLICATIONS", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_APPLICATIONS", response => {
        // console.log("response from Applications");
        // console.log(response);

        const appCount = response.length / 22;
        for (let i = 0; i < appCount; i++) {
          const idx = i * 22;
          this.settings.data.push({
            name: response[idx]["data_point_value"],
            guid: response[idx + 1]["data_point_value"],
            type: response[idx + 2]["data_point_value"],
            record_count: response[idx + 3]["data_point_value"],
            status: response[idx + 4]["data_point_value"],
            create_date: response[idx + 5]["data_point_value"],
            update_date: response[idx + 6]["data_point_value"],
            latest_record_date: response[idx + 7]["data_point_value"],
            workflow_builder_enabled: response[idx + 8]["data_point_value"],
            notifications_enabled: response[idx + 9]["data_point_value"],
            application_owners: response[idx + 10]["data_point_value"],
            solutions: response[idx + 11]["data_point_value"],
            license_end_date: response[idx + 12]["data_point_value"],
            datadriven_events: response[idx + 13]["data_point_value"],
            record_permission_fields: response[idx + 14]["data_point_value"],
            cross_reference_fields: response[idx + 15]["data_point_value"],
            module_id: response[idx + 16]["data_point_value"],
            is_system: response[idx + 17]["data_point_value"],
            is_deleted: response[idx + 18]["data_point_value"],
            is_decrypted: response[idx + 19]["data_point_value"],
            keep_licensed: response[idx + 20]["data_point_value"],
            is_licensed_object: response[idx + 21]["data_point_value"]
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