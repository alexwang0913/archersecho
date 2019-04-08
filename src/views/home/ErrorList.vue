<template>
  <div>
    <div class="vx-col w-full mb-base">
      <vx-card title="List of Errors in last 24 hours">
        <vs-list>
          <vs-list-item title="Error1" subtitle="Created at: 2019/04/01"></vs-list-item>
          <vs-list-item title="Error2" subtitle="Created at: 2019/04/02"></vs-list-item>
        </vs-list>
      </vx-card>
    </div>
  </div>
</template>

<script>
import { getFromStorage } from "../../utils";
import api from "../../api/dashboard";
export default {
  computed: {
    localUser() {
      return getFromStorage("user");
    }
  },
  data() {
    return {
      errorList: []
    };
  },
  mounted() {
    this.getErrorList();
  },
  methods: {
    async getErrorList() {
      this.errorList = await api.getErrorListLast24hours(this.localUser.id);
      console.log(this.errorList);
    }
  }
};
</script>

<style scoped>
</style>