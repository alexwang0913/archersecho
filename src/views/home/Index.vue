<template>
  <div>
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="BellIcon"
          statistic="92.6k"
          statisticTitle="Service server"
          :chartData="subscribersGained"
          type="area"
        ></statistics-card-line>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="DatabaseIcon"
          statistic="97.5K"
          statisticTitle="Database"
          :chartData="revenueGenerated"
          color="success"
          type="area"
        ></statistics-card-line>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="CloudIcon"
          statistic="36%"
          statisticTitle="Archer"
          :chartData="quarterlySales"
          color="danger"
          type="area"
        ></statistics-card-line>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="ServerIcon"
          statistic="97.5K"
          statisticTitle="Web servers"
          :chartData="ordersRecevied"
          color="warning"
          type="area"
        ></statistics-card-line>
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card title="Device Information">
          <!-- SLOT = ACTIONS -->
          <template slot="actions"></template>

          <!-- CHART -->
          <div slot="no-body">
            <!-- <vue-apex-charts type="radialBar" height="350" :options="chartOptions" :series="series"/> -->
          </div>

          <!-- CHART DATA -->
          <ul>
            <li
              v-for="orderData in analyticsData"
              :key="orderData.orderType"
              class="flex mb-3 justify-between"
            >
              <span class="flex items-center">
                <span
                  class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid"
                  :class="`border-${orderData.color}`"
                ></span>
                <span class="font-semibold">{{ orderData.orderType }}</span>
              </span>
              <span>{{ orderData.counts }}</span>
            </li>
          </ul>
        </vx-card>
      </div>
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card title="List of Errors in last 24 hours">
          <vs-list>
            <vs-list-item title="One text"></vs-list-item>
            <vs-list-item title="Another text" subtitle="A little text"></vs-list-item>
            <vs-list-item title="Some more text"></vs-list-item>
            <vs-list-item title="Even more text" subtitle="Another little text"></vs-list-item>
          </vs-list>
        </vx-card>
      </div>
    </div>

    <div class="vx-col w-full mb-base">
      <vx-card title="Datafeeds last 30days">
        <vue-apex-charts
          type="heatmap"
          height="350"
          :options="heatMapChart.chartOptions"
          :series="heatMapChart.series"
        ></vue-apex-charts>
      </vx-card>
    </div>

    <div class="vx-col w-full mb-base">
      <vx-card title="IP Geolocation map">
        <div id="world-map" style="width: 100%; height: 500px"></div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";
import VueApexCharts from "vue-apexcharts";
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
export default {
  data() {
    return {
      chartOptions: {
        labels: ["Services server", "Database", "Archer", "Web Servers"],
        plotOptions: {
          radialBar: {
            size: 165,
            hollow: {
              size: "20%"
            },
            track: {
              background: "#ebebeb",
              strokeWidth: "100%",
              margin: 15
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: "18px"
              },
              value: {
                fontSize: "16px",
                color: "#636a71",
                offsetY: 11
              },
              total: {
                show: true,
                label: "Total",
                formatter: function() {
                  return 10;
                }
              }
            }
          }
        },
        responsive: [
          {
            breakpoint: 576,
            options: {
              plotOptions: {
                radialBar: {
                  size: 150,
                  hollow: {
                    size: "20%"
                  },
                  track: {
                    background: "#ebebeb",
                    strokeWidth: "100%",
                    margin: 15
                  }
                }
              }
            }
          }
        ],
        colors: ["#7961F9", "#FF9F43", "#f29292"],
        fill: {
          type: "gradient",
          gradient: {
            // enabled: true,
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: ["#9c8cfc", "#FFC085", "#EA5455"],
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: "round"
        },
        chart: {
          dropShadow: {
            enabled: true,
            blur: 3,
            left: 1,
            top: 1,
            opacity: 0.1
          }
        }
      },
      series: [70, 52, 26, 30],
      analyticsData: [
        { orderType: "Services server", counts: 23043, color: "primary" },
        { orderType: "Database", counts: 14658, color: "warning" },
        { orderType: "Archer ", counts: 4758, color: "danger" },
        { orderType: "Web server ", counts: 4758, color: "success" },
        { orderType: "Users logged in", counts: 30, color: "#9c8cfc" }
      ],
      subscribersGained: {
        series: [
          {
            name: "Subscribers",
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
      themeColors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
      heatMapChart: {
        series: [
          {
            name: "Metric1",
            data: this.generateDataHeatMap(30, {
              min: 0,
              max: 10
            })
          }
        ],
        chartOptions: {
          colors: this.themeColors,
          dataLabels: {
            enabled: false
          },
          colors: ["#008FFB"]
        }
      }
    };
  },
  components: { ChangeTimeDurationDropdown, VueApexCharts, StatisticsCardLine },
  mounted() {
    this.initMap();
  },
  methods: {
    generateDataHeatMap(count, yrange) {
      var i = 0;
      var series = [];
      while (i < count) {
        var x = "Day" + (i + 1).toString();
        var y =
          Math.floor(Math.random() * (yrange.max - yrange.min + 1)) +
          yrange.min;

        series.push({
          x: x,
          y: y
        });
        i++;
      }
      return series;
    },
    async initMap() {
      this.mapLoading = true;
      const mapData = await deviceApi.getIisLogInfo(this.userId);
      console.log("Mapdata");
      console.log(mapData);
      $(function() {
        $("#world-map").vectorMap({
          map: "world_mill_en",
          scaleColors: ["#C8EEFF", "#0071A4"],
          normalizeFunction: "polynomial",
          hoverOpacity: 0.7,
          hoverColor: false,
          markerStyle: {
            initial: {
              fill: "#FFB70F",
              stroke: "#FFB70F"
            }
          },
          regionStyle: {
            initial: {
              fill: "#5D92F4"
            }
          },
          backgroundColor: "#fff",
          markers: mapData
        });
      });
      this.mapLoading = false;
    }
  }
};
</script>

<style scoped>
</style>