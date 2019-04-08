<template>
  <div
    class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-base vs-con-loading__container"
    id="div-services-server"
  >
    <vue-apex-charts type="line" height="350" :options="chartOptions" :series="series"></vue-apex-charts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  components: {
    VueApexCharts
  },
  data() {
    return {
      series: [
        {
          name: "Cpu Utilization",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chartOptions: {
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
        yaxis: {
          max: 100
        }
      }
    };
  }
};
</script>

<style scoped>
</style>