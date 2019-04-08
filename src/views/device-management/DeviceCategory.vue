<template>
  <div class="px-6 py-4">
    <div
      class="flex cursor-pointer"
      :class="{'text-primary': selectCategory === 0}"
      @click="onClickCategory(0)"
    >
      <feather-icon icon="ListIcon" svgClasses="stroke-current, h-6 w-6"></feather-icon>
      <span class="text-lg ml-3">All</span>
    </div>

    <vs-divider></vs-divider>

    <h5>Category</h5>
    <div class="todo__lables-list">
      <div
        class="todo__label flex items-center mt-6 cursor-pointer"
        :class="{'text-primary': selectCategory === (index+1)}"
        v-for="(tag, index) in categories"
        :key="index"
        @click="onClickCategory(tag.value)"
      >
        <div class="h-4 w-4 rounded-full mr-4 mb-2">
          <feather-icon :icon="tag.icon"></feather-icon>
        </div>
        <span class="text-lg">{{ tag.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      categories: [
        { text: "WebServer", value: 1, icon: "ServerIcon" },
        { text: "Services Server", value: 2, icon: "ShoppingCartIcon" },
        { text: "Database Server", value: 3, icon: "DatabaseIcon" },
        { text: "Other", value: 4, icon: "GridIcon" }
      ],
      selectCategory: 0,
      filterDevices: []
    };
  },
  computed: {
    ...mapState({
      devices: state => state.device.devices
    })
  },
  mounted() {
    this.filterDevices = this.devices;
  },
  methods: {
    onClickCategory(category) {
      if (category === 0) {
        this.filterDevices = this.devices;
      } else {
        this.filterDevices = this.devices.filter(device => {
          return device.type.indexOf(category) > -1;
        });
      }
      this.selectCategory = category;
      this.$store.commit("device/SET_FILTER_CATEGORY", category);
      // this.$store.commit("device/SET_DEVICE_LIST", this.filterDevices);
    }
  }
};
</script>

<style scoped>
</style>