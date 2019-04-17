<template>
  <div id="div-configuration-information" class="vs-con-loading__container">
    <vx-card title="Configuration Information">
      <vs-table max-items="10" pagination :data="confInfoList">
        <template slot="thead">
          <vs-th>Section Group</vs-th>
          <vs-th>Section Name</vs-th>
          <vs-th>DataPoint GroupKey</vs-th>
          <vs-th>Data Point</vs-th>
          <vs-th>Data Point Value</vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{ tr.section_group }}</vs-td>
            <vs-td>{{ tr.section_name }}</vs-td>
            <vs-td>{{ tr.data_point_group_key }}</vs-td>
            <vs-td>{{ tr.data_point }}</vs-td>
            <vs-td>{{ tr.data_point_value }}</vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  data() {
    return {
      socket: io(SERVER_URL),
      archerId: this.$route.params.id,

      confInfoList: [],
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
    this.getConfigInfoList();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getConfigInfoList() {
      this.$vs.loading({
        container: "#div-configuration-information",
        scale: 0.6
      });
      const data = {
        archerId: this.archerId,
        userId: this.user.id,
        database: "Configuration"
      };
      this.socket.emit("REQ_DB_CONFIGURATION", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_DB_CONFIGURATION", response => {
        // console.log("response from DbConfiguration");
        // console.log(response);
        this.confInfoList = response;
        this.$vs.loading.close(
          "#div-configuration-information > .con-vs-loading"
        );
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close(
            "#div-configuration-information > .con-vs-loading"
          );
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