<template>
  <vx-card title="Windows event log" class="mt-4">
    <vs-table :data="eventLogs">
      <template slot="thead">
        <vs-th>Event id</vs-th>
        <vs-th>Priority</vs-th>
        <vs-th>Summary</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{ tr.eventId }}</vs-td>

          <vs-td>{{ tr.priority }}</vs-td>

          <vs-td>{{ tr.summary }}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>
</template>

<script>
import deviceApi from "../../api/device";
export default {
  props: ["id"],
  data() {
    return {
      eventLogs: []
    };
  },
  mounted() {
    this.getEventLogs();
  },
  methods: {
    async getEventLogs() {
      this.eventLogs = await deviceApi.getEventLogs(this.id);
    }
  }
};
</script>

<style scoped>
</style>