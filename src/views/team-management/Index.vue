<template>
  <div>
    <my-team></my-team>
    <join-team></join-team>
  </div>
</template>

<script>
import MyTeam from "./MyTeam.vue";
import JoinTeam from "./JoinTeam.vue";
export default {
  components: {
    MyTeam,
    JoinTeam
  }
};
</script>

<style lang="scss" scoped>
</style>