<template>
  <div id="div-information" class="vs-con-loading__container">
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
      settings: {
        height: 500,
        rowHeights: 23,
        rowHeaders: true,
        data: [],
        colHeaders: [
          "Instance",
          "Instance use category",
          "Record count of licensed applications",
          "Default Timezone",
          "Single Sign-on mode",
          "# of active datafeeds",
          "# logins in last hour",
          "File repository size",
          "File repository count"
        ],
        columns: [
          { data: "instance", editor: false },
          { data: "instance_use_category", editor: false },
          { data: "record_count", editor: false },
          { data: "default_timezone", editor: false },
          { data: "single_signon", editor: false },
          { data: "active_datafeeds", editor: false },
          { data: "logins_in_last_hour", editor: false },
          { data: "file_repository_size", editor: false },
          { data: "file_repository_count", editor: false }
        ]
      },
      socket: io(SERVER_URL),
      database: this.$route.params.database,
      arriveResponse: false,
      timer: null
    };
  },
  computed: {
    user() {
      return getFromStorage("user");
    }
  },
  mounted() {
    this.getInformation();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getInformation() {
      this.$vs.loading({
        container: "#div-information",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      console.log(data);
      this.socket.emit("REQ_INSTANCE_INFORMATION", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_INSTANCE_INFORMATION", response => {
        console.log("response from information");
        console.log(response);

        let maxCount = 0;
        for (const data of response) {
          if (maxCount < data.record.length) {
            maxCount = data.record.length;
          }
        }
        this.settings.data = [];
        for (let i = 0; i < maxCount; i++) {
          this.settings.data.push({
            instance: response[0]["record"][i]
              ? response[0]["record"][i]["data_point_value"]
              : "",
            instance_use_category: response[1]["record"][i]
              ? response[1]["record"][i]["data_point_value"]
              : "",
            record_count: response[2]["record"][i]
              ? response[2]["record"][i]["data_point_value"]
              : "",
            default_timezone: response[3]["record"][i]
              ? response[3]["record"][i]["data_point_value"]
              : "",
            single_signon: response[4]["record"][i]
              ? response[4]["record"][i]["data_point_value"]
              : "",
            active_datafeeds: response[5]["record"][i]
              ? response[5]["record"][i]["data_point_value"]
              : "",
            logins_in_last_hour: response[6]["record"][i]
              ? response[6]["record"][i]["data_point_value"]
              : "",
            file_repository_size: response[7]["record"][i]
              ? response[7]["record"][i]["data_point_value"]
              : "",
            file_repository_count: response[8]["record"][i]
              ? response[8]["record"][i]["data_point_value"]
              : ""
          });
        }

        this.$vs.loading.close("#div-information > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-information > .con-vs-loading");
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
  }
};
</script>
<style lang="scss" scoped>
</style>