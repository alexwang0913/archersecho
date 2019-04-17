<template>
  <div id="div-ldap-sync-information" class="vs-con-loading__container">
    <vue-apex-charts
      type="heatmap"
      height="350"
      width="700"
      :options="heatMapChart.chartOptions"
      :series="heatMapChart.series"
    ></vue-apex-charts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  components: { VueApexCharts },
  data() {
    return {
      themeColors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
      heatMapChart: {
        series: [],
        chartOptions: {
          colors: ["#EA5455"],
          dataLabels: {
            enabled: false
          }
        }
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
    this.getLDAPSyncInformation();
    this.responseSocket();
    this.checkResponse();
  },
  methods: {
    getLDAPSyncInformation() {
      this.$vs.loading({
        container: "#div-ldap-sync-information",
        scale: 0.6
      });

      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };

      this.socket.emit("REQ_LDAP_ERROR_SUMMARY", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });

      this.socket.on("RES_LDAP_ERROR_SUMMARY", response => {
        console.log("response from LDAPSyncInformation");
        console.log(response);
        for (const data of response) {
          this.heatMapChart.series.push({
            name: data.Week,
            data: [
              { x: "Sun", y: data.Sun },
              { x: "Mon", y: data.Mon },
              { x: "Tue", y: data.Tue },
              { x: "Wed", y: data.Wed },
              { x: "Thu", y: data.Thu },
              { x: "Fri", y: data.Fri },
              { x: "Sat", y: data.Sat },
              { x: "Weekly", y: data.Weekly }
            ]
          });
        }
        this.$vs.loading.close("#div-ldap-sync-information > .con-vs-loading");
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-ldap-sync-information > .con-vs-loading");
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