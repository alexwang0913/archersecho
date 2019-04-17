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
        data: [{ week: 1 }],
        colHeaders: [
          "Week",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
          "Total"
        ],
        columns: [
          { data: "week", editor: false },
          { data: "mon", editor: false },
          { data: "tue", editor: false },
          { data: "wed", editor: false },
          { data: "thu", editor: false },
          { data: "fri", editor: false },
          { data: "sat", editor: false },
          { data: "sun", editor: false },
          { data: "total", editor: false }
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
    this.getData();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    async getData() {
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
          sectionName: "Login History",
          method: "LOGIN_HISTORY",
          database: instance.database
        };
        this.socket.emit("REQ_LOGIN_HISTORY", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_LOGIN_HISTORY", response => {
        const count = response.length / 9;
        for (let i = 0; i < count; i++) {
          const idx = i * 9;
          this.settings.data.push({
            week: response[idx]["data_point_value"],
            mon: response[idx + 1]["data_point_value"],
            tue: response[idx + 2]["data_point_value"],
            wed: response[idx + 3]["data_point_value"],
            thu: response[idx + 4]["data_point_value"],
            fri: response[idx + 5]["data_point_value"],
            sat: response[idx + 6]["data_point_value"],
            sun: response[idx + 7]["data_point_value"],
            total: response[idx + 8]["data_point_value"]
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