<template>
  <div id="div-data-feed" class="vs-con-loading__container">
    <vs-button class="mb-4" @click="getDataFeeds">Get Datafeeds</vs-button>
    <vs-table :data="dataFeeds">
      <template slot="thead">
        <vs-th>Id</vs-th>
        <vs-th>Name</vs-th>
        <vs-th>Next schedule date</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Is active</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{ tr.datafeed_id }}</vs-td>
          <vs-td>{{ tr.datafeed_name }}</vs-td>
          <vs-td>{{ tr.next_scheduled_date }}</vs-td>
          <vs-td>
            <vs-chip>{{getStatusLabel(tr.status)}}</vs-chip>
          </vs-td>
          <vs-td>{{tr.is_active}}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  data() {
    return {
      dataFeeds: [],
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
    this.getDataFeeds();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getDataFeeds() {
      this.$vs.loading({
        container: "#div-data-feed",
        scale: 0.6
      });
      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      this.socket.emit("REQ_DATA_FEED", data);
      this.checkResponse();
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_DATA_FEED", data => {
        this.dataFeeds = data;
        this.$vs.loading.close("#div-data-feed > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    getStatusLabel(status) {
      if (status === 1) {
        return "Running";
      } else if (status === 2) {
        return "Completed";
      } else if (status === 3) {
        return "Faulted";
      } else if (status === 4) {
        return "Warning";
      } else if (status === 5) {
        return "Terminating";
      } else if (status === 6) {
        return "Terminated";
      } else if (status === 7) {
        return "Pending";
      }
      return "N/A";
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-data-feed > .con-vs-loading");
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