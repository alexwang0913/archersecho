<template>
  <vx-card title="Process information" class="mt-4">
    <add-process :deviceId="id"></add-process>
    <vs-table :data="process">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Last update time</vs-th>
        <vs-th>Enable / Disable</vs-th>
        <vs-th></vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in process">
          <vs-td>{{ tr.Name }}</vs-td>

          <vs-td>{{ tr.Status }}</vs-td>

          <vs-td>{{ getUpdateAt(tr.updateAt) }}</vs-td>
          <vs-td>
            <vs-switch color="success" v-model="tr.isActive"/>
          </vs-td>
          <vs-td>
            <div class="vx-row">
              <vs-button color="primary" type="border" icon="edit" radius size="small" class="mr-2"></vs-button>
              <vs-button color="danger" type="border" icon="delete" radius size="small"></vs-button>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>
</template>

<script>
import AddProcess from "./AddProcess.vue";
export default {
  props: ["process", "id"],
  components: {
    AddProcess
  },
  mounted() {
    console.log(this.process);
  },
  methods: {
    getUpdateAt(value) {
      return value ? value.replace("T", " ").split(".")[0] : "--";
    }
  }
};
</script>

<style scoped>
</style>