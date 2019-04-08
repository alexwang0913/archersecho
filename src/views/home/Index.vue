<template>
  <div>
    <statistics></statistics>
    <error-list></error-list>

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

/** Local components */
import Statistics from "./Statistics";
import ErrorList from "./ErrorList";
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
      themeColors: ["#7367F0", "#28C76F", "#EA5455", "#FF9F43", "#1E1E1E"],
      heatMapChart: {
        series: [
          {
            name: "",
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
          }
        }
      }
    };
  },
  components: {
    ChangeTimeDurationDropdown,
    VueApexCharts,
    Statistics,
    ErrorList
  },
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
      // const mapData = await deviceApi.getIisLogInfo(this.userId);
      // console.log("Mapdata");
      // console.log(mapData);
      // $(function() {
      //   $("#world-map").vectorMap({
      //     map: "world_mill_en",
      //     scaleColors: ["#C8EEFF", "#0071A4"],
      //     normalizeFunction: "polynomial",
      //     hoverOpacity: 0.7,
      //     hoverColor: false,
      //     markerStyle: {
      //       initial: {
      //         fill: "#FFB70F",
      //         stroke: "#FFB70F"
      //       }
      //     },
      //     regionStyle: {
      //       initial: {
      //         fill: "#5D92F4"
      //       }
      //     },
      //     backgroundColor: "#fff",
      //     markers: mapData
      //   });
      // });
      // this.mapLoading = false;
    }
  }
};
</script>

<style scoped>
</style>