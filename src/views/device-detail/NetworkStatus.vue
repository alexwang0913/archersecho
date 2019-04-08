<template>
  <vx-card title="Network information" class="mt-4">
    <vs-table :data="networks">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Send(kbps)</vs-th>
        <vs-th>Receive(kbps)</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in networks">
          <vs-td :data="tr.Name">{{ tr.Name }}</vs-td>

          <vs-td :data="tr.Send">{{ tr.Send.toFixed(1) }}</vs-td>

          <vs-td :data="tr.Receive">{{ tr.Receive.toFixed(1) }}</vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>
</template>

<script>
export default {
  props: ["networks"]
};
</script>

<style scoped>
</style>