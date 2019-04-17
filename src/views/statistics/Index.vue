<template>
  <div>
    <vx-card>
      <vs-tabs>
        <vs-tab v-for="(tab, index) in tabs" :key="index" :vs-label="tab" @click="selectTab = tab"></vs-tab>
      </vs-tabs>
      <keep-alive>
        <component :is="selectTab"></component>
      </keep-alive>
    </vx-card>
  </div>
</template>

<script>
import Uptime from "./Uptime";
import Datafeed from "./Datafeed";
import { saveToStorage } from "../../utils";
export default {
  components: {
    Uptime,
    Datafeed
  },
  data() {
    return {
      archerId: this.$route.params.id,
      tabs: ["Uptime", "Datafeed"],
      selectTab: "Uptime"
    };
  },
  mounted() {
    saveToStorage("archerId", this.archerId);
  }
};
</script>

<style lang="scss" scoped>
</style>