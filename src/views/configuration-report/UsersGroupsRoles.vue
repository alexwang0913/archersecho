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
        data: [{ all_user_accounts: 1 }],
        height: 100,
        colHeaders: [
          "Count of All User Accounts",
          "Count of Active User Accounts",
          "Count of Groups",
          "Count of Roles",
          "Count of Deleted Users",
          "Count of Inactive Users",
          "Count of Groups without Users",
          "Count of Groups with Users"
        ],
        columns: [
          { data: "all_user_accounts", editor: false },
          { data: "active_user_accounts", editor: false },
          { data: "groups", editor: false },
          { data: "roles", editor: false },
          { data: "deleted_users", editor: false },
          { data: "inactive_users", editor: false },
          { data: "groups_without_users", editor: false },
          { data: "groups_with_users", editor: false }
        ]
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
          sectionName: "Users, Groups and Roles",
          method: "USER_GROUPS_ROLES",
          database: instance.database
        };
        this.socket.emit("REQ_USER_GROUPS_ROLES", data);
      }
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.userId);
      });

      this.socket.on("RES_USER_GROUPS_ROLES", response => {
        const count = response.length / 8;
        for (let i = 0; i < count; i++) {
          const idx = i * 8;
          this.settings.data.push({
            all_user_accounts: response[idx]["data_point_value"],
            active_user_accounts: response[idx + 1]["data_point_value"],
            groups: response[idx + 2]["data_point_value"],
            roles: response[idx + 3]["data_point_value"],
            deleted_users: response[idx + 4]["data_point_value"],
            inactive_users: response[idx + 5]["data_point_value"],
            groups_without_users: response[idx + 6]["data_point_value"],
            groups_with_users: response[idx + 7]["data_point_value"]
          });
        }

        if (++this.resCount === this.instances.length) {
          this.$vs.loading.close("#div-loading > .con-vs-loading");
        }
        this.responseSocket = true;
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