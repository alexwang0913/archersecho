<template>
  <div class="vx-col w-full mb-base">
    <vx-card title="IP Geolocation map">
      <div id="world-map" style="width: 100%; height: 500px"></div>
    </vx-card>
  </div>
</template>

<script>
import deviceApi from "../../api/device";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initMap();
  },
  methods: {
    async initMap() {
      const mapData = await deviceApi.getIisLogInfo(getFromStorage("user").id);

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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>