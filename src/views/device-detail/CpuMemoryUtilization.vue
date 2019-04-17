<template>
  <div class="vx-row">
    <div
      class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base vs-con-loading__container"
      id="div-services-server"
    >
      <vue-apex-charts type="line" height="350" :options="cpuChartOptions" :series="cpuSeries"></vue-apex-charts>
    </div>
    <div
      class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base vs-con-loading__container"
      id="div-services-server"
    >
      <vue-apex-charts
        type="line"
        height="350"
        :options="memoryChartOptions"
        :series="memorySeries"
      ></vue-apex-charts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import deviceApi from "../../api/device";
export default {
  props: ["id"],
  components: { VueApexCharts },
  data() {
    return {
      cpuSeries: [],
      cpuChartOptions: {
        chart: {
          height: 350,
          zoom: {
            enabled: false
          }
        },
        colors: ["#7367F0"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "CPU Utilization",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          labels: {
            show: false
          }
        }
      },
      memorySeries: [],
      memoryChartOptions: {
        chart: {
          height: 350,
          zoom: {
            enabled: false
          }
        },
        colors: ["#EA5455"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "Memory Utilization",
          align: "left"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          labels: {
            show: false
          }
        }
      }
    };
  },
  mounted() {
    this.getChartData();
  },
  methods: {
    async getChartData() {
      const response = await deviceApi.getCpuMemoryUtilizationData(this.id);
      const cpuData = [],
        memoryData = [];

      for (const data of response) {
        cpuData.push(data.cpuUsage ? data.cpuUsage : 0);
        memoryData.push(data.memoryAvailable ? data.memoryAvailable : 0);
      }
      // console.log(cpuData);
      // console.log(memoryData);
      // console.log(xAxis);
      this.cpuSeries.push({
        name: "Cpu Utilization",
        data: cpuData
      });
      this.memorySeries.push({
        name: "Memory Utilization",
        data: memoryData
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>