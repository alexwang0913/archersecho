<template>
  <div id="div-contentinfo" class="vs-con-loading__container">
    <vx-card title="Content Created - Last 45days">
      <vue-apex-charts
        type="heatmap"
        height="350"
        :options="contentCreatedHeatmapChart.chartOptions"
        :series="contentCreatedHeatmapChart.series"
      ></vue-apex-charts>
    </vx-card>

    <vx-card class="mt-4" title="Content Updated - Last 45days">
      <vue-apex-charts
        type="heatmap"
        height="350"
        :options="contentUpdatedHeatmapChart.chartOptions"
        :series="contentUpdatedHeatmapChart.series"
      ></vue-apex-charts>
    </vx-card>
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
      socket: io(SERVER_URL),
      database: this.$route.params.database,

      contentCreatedHeatmapChart: {
        series: [],
        chartOptions: {
          colors: ["#28C76F"],
          dataLabels: {
            enabled: false
          }
        }
      },
      contentUpdatedHeatmapChart: {
        series: [],
        chartOptions: {
          colors: ["#7367F0"],
          dataLabels: {
            enabled: false
          }
        }
      },

      resCount: 0,
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
        container: "#div-contentinfo",
        scale: 0.6
      });

      const data = {
        userId: this.user.id,
        archerId: getFromStorage("archerId"),
        instance: this.database
      };
      this.socket.emit("REQ_CONTENT_CREATED", data);
      this.socket.emit("REQ_CONTENT_UPDATED", data);
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", this.user.id);
      });
      this.socket.on("RES_CONTENT_CREATED", response => {
        // console.log("response from ContentCreated");
        // console.log(response);
        this.contentCreatedHeatmapChart.series = [];
        for (const data of response) {
          this.contentCreatedHeatmapChart.series.push({
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

        if (++this.resCount === 2) {
          this.$vs.loading.close("#div-contentinfo > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
      this.socket.on("RES_CONTENT_UPDATED", response => {
        console.log("response from ContentUpdated");
        console.log(response);
        this.contentUpdatedHeatmapChart.series = [];
        for (const data of response) {
          this.contentUpdatedHeatmapChart.series.push({
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

        if (++this.resCount === 2) {
          this.$vs.loading.close("#div-contentinfo > .con-vs-loading");
        }
        this.arriveResponse = true;
      });
    },
    checkResponse() {
      const vm = this;
      setTimeout(() => {
        if (!vm.arriveResponse) {
          vm.$vs.loading.close("#div-contentinfo > .con-vs-loading");
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