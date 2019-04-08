<template>
  <div>
    <div class="vx-row">
      <div
        class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base vs-con-loading__container"
        id="div-services-server"
      >
        <statistics-card-line
          icon="BellIcon"
          :statistic="servicesServerCount"
          statisticTitle="Service server"
          :chartData="subscribersGained"
          type="area"
        ></statistics-card-line>
      </div>
      <div
        class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base vs-con-loading__container"
        id="div-database"
      >
        <statistics-card-line
          icon="DatabaseIcon"
          :statistic="databaseCount"
          statisticTitle="Database"
          :chartData="revenueGenerated"
          color="success"
          type="area"
        ></statistics-card-line>
      </div>
      <div
        class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base vs-con-loading__container"
        id="div-archer"
      >
        <statistics-card-line
          icon="CloudIcon"
          :statistic="archerCount"
          statisticTitle="Archer"
          :chartData="quarterlySales"
          color="danger"
          type="area"
        ></statistics-card-line>
      </div>
      <div
        class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base vs-con-loading__container"
        id="div-webserver"
      >
        <statistics-card-line
          icon="ServerIcon"
          :statistic="webServerCount"
          statisticTitle="Web servers"
          :chartData="ordersRecevied"
          color="warning"
          type="area"
        ></statistics-card-line>
      </div>
    </div>
  </div>
</template>

<script>
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import { getFromStorage } from "../../utils";
import api from "../../api/dashboard";
export default {
  components: {
    StatisticsCardLine
  },
  data() {
    return {
      subscribersGained: {
        series: [
          {
            name: "ServicesServers",
            data: [28, 40, 36, 52, 38, 60, 55]
          }
        ],
        chartOptions: {
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0
            }
          },
          chart: {
            toolbar: {
              show: false
            },
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth",
            width: 2.5
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100]
            }
          },
          xaxis: {
            type: "numeric",
            lines: {
              show: false
            },
            axisBorder: {
              show: false
            },
            labels: { show: false }
          },
          yaxis: [
            {
              y: 0,
              offsetX: 0,
              offsetY: 0,
              padding: { left: 0, right: 0 }
            }
          ],
          tooltip: {
            x: { show: false }
          }
        }
      },
      quarterlySales: {
        series: [
          {
            name: "Sales",
            data: [10, 15, 7, 12, 3, 16]
          }
        ],
        chartOptions: {
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0
            }
          },
          chart: {
            toolbar: {
              show: false
            },
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth",
            width: 2.5
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100]
            }
          },
          xaxis: {
            type: "numeric",
            lines: {
              show: false
            },
            axisBorder: {
              show: false
            },
            labels: { show: false }
          },
          yaxis: [
            {
              y: 0,
              offsetX: 0,
              offsetY: 0,
              padding: { left: 0, right: 0 }
            }
          ],
          tooltip: {
            x: { show: false }
          }
        }
      },
      revenueGenerated: {
        series: [
          {
            name: "Revenue",
            data: [350, 275, 400, 300, 350, 300, 450]
          }
        ],
        chartOptions: {
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0
            }
          },
          chart: {
            toolbar: {
              show: false
            },
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth",
            width: 2.5
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100]
            }
          },
          xaxis: {
            type: "numeric",
            lines: {
              show: false
            },
            axisBorder: {
              show: false
            },
            labels: { show: false }
          },
          yaxis: [
            {
              y: 0,
              offsetX: 0,
              offsetY: 0,
              padding: { left: 0, right: 0 }
            }
          ],
          tooltip: {
            x: { show: false }
          }
        }
      },
      ordersRecevied: {
        series: [
          {
            name: "Orders",
            data: [10, 15, 8, 15, 7, 12, 8]
          }
        ],
        chartOptions: {
          grid: {
            show: false,
            padding: {
              left: 0,
              right: 0
            }
          },
          chart: {
            toolbar: {
              show: false
            },
            sparkline: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: "smooth",
            width: 2.5
          },
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.9,
              opacityFrom: 0.7,
              opacityTo: 0.5,
              stops: [0, 80, 100]
            }
          },
          xaxis: {
            type: "numeric",
            lines: {
              show: false
            },
            axisBorder: {
              show: false
            },
            labels: { show: false }
          },
          yaxis: [
            {
              y: 0,
              offsetX: 0,
              offsetY: 0,
              padding: { left: 0, right: 0 }
            }
          ],
          tooltip: {
            x: { show: false }
          }
        }
      },
      servicesServerCount: 0,
      databaseCount: 0,
      archerCount: 0,
      webServerCount: 0
    };
  },
  computed: {
    localUser() {
      return getFromStorage("user");
    }
  },
  mounted() {
    this.getServicesServerCount();
    this.getDatabaseCount();
    this.getArcherCount();
    this.getWebserverCount();
  },
  methods: {
    async getServicesServerCount() {
      this.$vs.loading({
        container: "#div-services-server",
        scale: 0.6
      });
      this.servicesServerCount = await api.getServicesServerCount(
        this.localUser.id
      );
      this.$vs.loading.close("#div-services-server > .con-vs-loading");
    },
    async getDatabaseCount() {
      this.$vs.loading({
        container: "#div-database",
        scale: 0.6
      });
      this.databaseCount = await api.getDatabaseCount(this.localUser.id);
      this.$vs.loading.close("#div-database > .con-vs-loading");
    },
    async getArcherCount() {
      this.$vs.loading({
        container: "#div-archer",
        scale: 0.6
      });
      this.archerCount = await api.getArcherCount(this.localUser.id);
      this.$vs.loading.close("#div-archer > .con-vs-loading");
    },
    async getWebserverCount() {
      this.$vs.loading({
        container: "#div-webserver",
        scale: 0.6
      });
      this.webServerCount = await api.getWebServerCount(this.localUser.id);
      this.$vs.loading.close("#div-webserver > .con-vs-loading");
    }
  }
};
</script>

<style scoped>
</style>