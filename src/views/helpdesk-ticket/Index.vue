<template>
  <div>
    <my-help-desk></my-help-desk>
    <request-help-desk></request-help-desk>
  </div>
</template>

<script>
import MyHelpDesk from "./MyHelpDesk.vue";
import RequestHelpDesk from "./RequestHelpDesk.vue";
export default {
  components: {
    MyHelpDesk,
    RequestHelpDesk
  }
};
</script>

<style lang="scss" scoped>
</style>