<template>
  <div>
    <div class="vx-col w-full mb-base">
      <vx-card title="List of Errors in last 24 hours">
        <vs-list>
          <vs-list-item
            v-for="(error, index) in errorList"
            :key="index"
            :title="error.name"
            :subtitle="getErrorTime(error.createdAt)"
          ></vs-list-item>
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
    },
    getErrorTime(time) {
      return `Created At: ${time.replace("T", " ").split(".")[0]}`;
    }
  }
};
</script>

<style scoped>
</style>