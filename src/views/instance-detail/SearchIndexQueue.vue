<template>
  <div id="div-searchindex-queue" class="vs-con-loading__container">
    <vs-row class="mb-4">
      <span>Remaining:</span>
      <span class="font-semibold ml-2">{{settings.data.length}}</span>
    </vs-row>
    <hot-table :settings="settings"></hot-table>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";
import { HotTable } from "@handsontable/vue";

export default {
  components: { HotTable },
  data() {
    return {
      socket: io(SERVER_URL),
      database: this.$route.params.database,

      settings: {
        height: 500,
        rowHeights: 23,
        rowHeaders: true,
        data: [],
        colHeaders: [
          "Type",
          "Module Name",
          "Conent Id",
          "Created",
          "Updated",
          "Last Updated By",
          "File Name",
          "Queued",
          "Priority",
          "Message Id",
          "Sequential Id"
        ],
        columns: [
          { data: "RecordType", editor: false },
          { data: "ModuleName", editor: false },
          { data: "ContentId", editor: false },
          { data: "ContentCreated", editor: false },
          { data: "ContentUpdated", editor: false },
          { data: "LastUpdatedBy", editor: false },
          { data: "FileName", editor: false },
          { data: "QueueDate", editor: false },
          { data: "Priority", editor: false },
          { data: "MessageId", editor: false },
          { data: "SequentialId", editor: false }
        ]
      },
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
    this.getData();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getData() {
      this.$vs.loading({
        container: "#div-searchindex-queue",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      this.socket.emit("REQ_SEARCH_INDEX", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_SEARCH_INDEX", response => {
        console.log("response from SearchIndexQueue");
        console.log(response);
        this.settings.data = response;
        this.$vs.loading.close("#div-searchindex-queue > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-searchindex-queue > .con-vs-loading");
          vm.$vs.notify({
            color: "warning",
            title: "Warning",
            text: "No response from server."
          });
        }
      }, 1000 * 10);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>