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
        height: 100,
        data: [],
        colHeaders: [
          "Instance",
          "Instance ID",
          "Instance Use Category",
          "Record Count of Licensed Applications",
          "Create Date",
          "DefaultTime Zone",
          "Default Locale",
          "Log Level",
          "Queuing Services Server",
          "Signle Sign-On Mode",
          "#of Active Data Feeds",
          "#Logins in Last Hour",
          "All System Jobs Exist",
          "License End Date"
        ],
        columns: [
          { data: "instance", editor: false },
          { data: "instance_id", editor: false },
          { data: "instance_use_category", editor: false },
          { data: "record_count_of_licensed_applications", editor: false },
          { data: "create_date", editor: false },
          { data: "default_time_zone", editor: false },
          { data: "default_locale", editor: false },
          { data: "log_level", editor: false },
          { data: "queuing_services_server", editor: false },
          { data: "single_signon_mode", editor: false },
          { data: "active_date_feeds", editor: false },
          { data: "logins_in_last_hour", editor: false },
          { data: "all_system_jobs_exist", editor: false },
          { data: "license_end_date", editor: false }
        ]
      },
      arriveResponse: false,
      timer: null
    };
  },
  mounted() {
    this.getInstanceSummary();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getInstanceSummary() {
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      const data = {
        archerId: this.archerId,
        userId: this.userId,
        sectionName: "Instance Summary",
        database: "Configuration",
        method: "INSTANCE_SUMMARY"
      };
      console.log(data);
      this.socket.emit("REQ_INSTANCE_SUMMARY", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_INSTANCE_SUMMARY", response => {
        // console.log("response from Instance Summary");
        // console.log(response);

        let instanceSummary = {
          instance: "",
          instance_id: "",
          instance_use_category: "",
          record_count_of_licensed_applications: "",
          create_date: "",
          default_time_zone: "",
          default_locale: "",
          log_level: "",
          queuing_services_server: "",
          single_signon_mode: "",
          active_date_feeds: "",
          logins_in_last_hour: "",
          all_system_jobs_exist: "",
          license_end_date: ""
        };
        for (const data of response) {
          if (data.data_point === "Instance") {
            instanceSummary.instance = data.data_point_value;
          } else if (data.data_point === "Instance ID") {
            instanceSummary.instance_id = data.data_point_value;
          } else if (data.data_point === "Instance Use Category") {
            instanceSummary.instance_use_category = data.data_point_value;
          } else if (
            data.data_point === "Record Count of Licensed Applications"
          ) {
            instanceSummary.record_count_of_licensed_applications =
              data.data_point_value;
          } else if (data.data_point === "Create Date") {
            instanceSummary.create_date = data.data_point_value;
          } else if (data.data_point === "Default Time Zone") {
            instanceSummary.default_time_zone = data.data_point_value;
          } else if (data.data_point === "Default Locale") {
            instanceSummary.default_locale = data.data_point_value;
          } else if (data.data_point === "Log Level") {
            instanceSummary.log_level = data.data_point_value;
          } else if (data.data_point === "Queuing Service Server") {
            instanceSummary.queuing_services_server = data.data_point_value;
          } else if (data.data_point === "Single Sign-On Mode") {
            instanceSummary.single_signon_mode = data.data_point_value;
          } else if (data.data_point === "# of Active Data Feeds") {
            instanceSummary.active_date_feeds = data.data_point_value;
          } else if (data.data_point === "# Logins In Last Hour") {
            instanceSummary.logins_in_last_hour = data.data_point_value;
          } else if (data.data_point === "All System Jobs Exist") {
            instanceSummary.all_system_jobs_exist = data.data_point_value;
          } else if (data.data_point === "License End Date") {
            instanceSummary.license_end_date = data.data_point_value;
          }
        }
        this.settings.data.push(instanceSummary);

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