<template>
  <vx-card title="Driver information" class="mt-4">
    <vs-table :data="drives">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Total size (GB)</vs-th>
        <vs-th>Available size (GB)</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in drives">
          <vs-td :data="tr.Label">{{ tr.Label }}</vs-td>

          <vs-td :data="tr.Total">{{ getGigaByte(tr.Total) }}</vs-td>

          <vs-td :data="tr.Available">{{ getGigaByte(tr.Available) }}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>
</template>

<script>
export default {
  props: ["drives"],
  methods: {
    getGigaByte(kiroByte) {
      return Math.round(kiroByte / Math.pow(1024, 3));
    }
  }
};
</script>

<style scoped>
</style>