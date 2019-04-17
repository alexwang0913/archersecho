<template>
  <div class="mt-4">
    <vx-card title="Request HelpDesk">
      <vs-table :data="helpDesks">
        <template slot="thead">
          <vs-th>Name</vs-th>
          <vs-th>Status</vs-th>
          <vs-th>Opened By</vs-th>
          <vs-th>Open Date</vs-th>
          <vs-th>Closed By</vs-th>
          <vs-th>Close Date</vs-th>
          <vs-th></vs-th>
        </template>

        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>{{tr.name}}</vs-td>
            <vs-td>{{getStatusLabel(tr.status)}}</vs-td>
            <vs-td>
              <vs-chip>
                <vs-avatar></vs-avatar>
                {{tr.openedBy.userId}}
              </vs-chip>
            </vs-td>
            <vs-td>{{tr.openDate.split("T")[0]}}</vs-td>
            <vs-td>{{tr.closedBy}}</vs-td>
            <vs-td>{{tr.closeDate}}</vs-td>
            <vs-td>
              <feather-icon
                icon="EyeIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="$router.push({'path': `helpdesk-ticket/detail/${tr._id}`})"
              ></feather-icon>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>

<script>
import { getFromStorage } from "../../utils";
import helpDeskApi from "../../api/helpDesk";
export default {
  data() {
    return {
      helpDesks: []
    };
  },
  mounted() {
    this.getHelpDeskTicket();
  },
  methods: {
    async getHelpDeskTicket() {
      this.helpDesks = await helpDeskApi.requestHelpDesk(
        getFromStorage("user").id
      );
      console.log(this.helpDesks);
    },
    getStatusLabel(status) {
      switch (status) {
        case 0:
          return "Open";
        case 1:
          return "In Progress";
        case 2:
          return "Waiting";
        case 3:
          return "Stopped";
        case 4:
          return "Done";
      }
      return "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>