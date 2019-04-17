<template>
  <div id="div-application-field" class="vs-con-loading__container">
    <vs-input icon="search" placeholder="Search" v-model="keyword" class="mb-4" @keyup="search"/>
    <hot-table :settings="settings"></hot-table>
    <vs-pagination :total="pageLength" v-model="page" goto @change="getApplicationField"></vs-pagination>
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
        data: [],
        colHeaders: [
          "Module Id",
          "Application",
          "Application Type",
          "Level Id",
          "Level",
          "Field Id",
          "Field Name",
          "Alias",
          "Description",
          "Field Type Id",
          "Field Type",
          "Status",
          "Locked/Static/Normal/Hidden",
          "Required",
          "Search Results",
          "Display Control Id",
          "Display Control",
          "Calculated",
          "Value List",
          "Value List Type",
          "Report Base Id",
          "Min Value",
          "Max Value",
          "Referenced Module",
          "Referenced Level",
          "Help Text",
          "Access",
          "Field Access - Groups",
          "Full Access - Groups",
          "Cascade - Groups",
          "Field Access - Users",
          "Full Access - Users",
          "Reports",
          "Encrypted",
          "Encryption State"
        ],

        columns: [
          { data: "aso_name", editor: false },
          { data: "Application", editor: false },
          { data: "Application Type", editor: false },
          { data: "level_id", editor: false },
          { data: "Level", editor: false },
          { data: "field_id", editor: false },
          { data: "field_name", editor: false },
          { data: "Alias", editor: false },
          { data: "Description", editor: false },
          { data: "field_type_name", editor: false },
          { data: "Field Type", editor: false },
          { data: "Status", editor: false },
          { data: "locked/static/normal/hidden", editor: false },
          { data: "required", editor: false },
          { data: "Search Results", editor: false },
          { data: "display_control_id", editor: false },
          { data: "Display Control", editor: false },
          { data: "calculated", editor: false },
          { data: "Value List", editor: false },
          { data: "Value list type", editor: false },
          { data: "report_base_id", editor: false },
          { data: "min_value", editor: false },
          { data: "max_value", editor: false },
          { data: "referenced module", editor: false },
          { data: "referenced level", editor: false },
          { data: "Help Text", editor: false },
          { data: "Access", editor: false },
          { data: "Field Access - Groups", editor: false },
          { data: "Full Access - Groups", editor: false },
          { data: "Cascade - Groups", editor: false },
          { data: "Field Access - Users", editor: false },
          { data: "Full Access - Users", editor: false },
          { data: "Reports (as display field)", editor: false },
          { data: "Encrypted", editor: false },
          { data: "Encryption State", editor: false }
        ]
      },
      socket: io(SERVER_URL),
      database: this.$route.params.database,
      page: 1,
      keyword: "",
      resCount: 0,
      pageLength: 1,
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
    this.getApplicationField();
    this.responseSocket();
  },
  methods: {
    getApplicationField() {
      this.$vs.loading({
        container: "#div-application-field",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database,
        page: this.page,
        keyword: "%" + this.keyword + "%"
      };
      this.socket.emit("REQ_APPLICATION_FIELD", data);
      this.socket.emit("REQ_APPLICATION_FIELD_COUNT", data);
      this.arriveResponse = false;
      this.checkResponse();
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_APPLICATION_FIELD", data => {
        console.log("response from RES_APPLICATION_FIELD");
        console.log(data);

        this.settings.data = data;
        this.resCount += 1;
        if (this.resCount === 2) {
          this.resCount = 0;
          this.$vs.loading.close("#div-application-field > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_APPLICATION_FIELD_COUNT", data => {
        console.log("response from RES_APPLICATION_FIELD_COUNT");
        console.log(data);

        this.pageLength = Math.ceil(data / 50);
        this.resCount += 1;
        if (this.resCount === 2) {
          this.resCount = 0;
          this.$vs.loading.close("#div-application-field > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
    },
    search(e) {
      if (e.keyCode === 13) {
        this.getApplicationField();
      }
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-application-field > .con-vs-loading");
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