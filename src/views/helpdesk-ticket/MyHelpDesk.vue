<template>
  <vx-card title="My HelpDesk Tickets">
    <vs-button
      class="mb-4"
      @click="$router.push({'name': 'add-helpdesk-ticket'})"
    >Add HelpDesk Ticket</vs-button>
    <vs-table :data="helpDesks">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Open Date</vs-th>
        <vs-th>Closed By</vs-th>
        <vs-th>Close Date</vs-th>
        <vs-th>Assigned Members</vs-th>
        <vs-th></vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>{{tr.name}}</vs-td>
          <vs-td>{{getStatusLabel(tr.status)}}</vs-td>
          <vs-td>{{tr.openDate.split("T")[0]}}</vs-td>
          <vs-td>{{tr.closedBy}}</vs-td>
          <vs-td>{{tr.closeDate}}</vs-td>
          <vs-td>
            <vs-chip v-for="(member, idx) in tr.assignedTo" :key="idx">
              <vs-avatar></vs-avatar>
              {{member.userId}}
            </vs-chip>
          </vs-td>
          <vs-td>
            <feather-icon
              icon="EyeIcon"
              class="cursor-pointer"
              svgClasses="w-5 h-5 mr-4"
              @click="$router.push({'path': `helpdesk-ticket/detail/${tr._id}`})"
            ></feather-icon>
            <feather-icon
              icon="TrashIcon"
              class="cursor-pointer"
              svgClasses="w-5 h-5 mr-4"
              @click="confirmDialog(tr)"
            ></feather-icon>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </vx-card>
</template>

<script>
import helpDeskApi from "../../api/helpDesk";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {
      helpDesks: [],
      ticketToDelete: null
    };
  },
  mounted() {
    this.getHelpDeskTickets();
  },
  methods: {
    async getHelpDeskTickets() {
      this.helpDesks = await helpDeskApi.getMyHelpDeskTickets(
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
    },
    confirmDialog(item) {
      this.ticketToDelete = item;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this ticket?",
        accept: this.deleteTicket
      });
    },
    async deleteTicket() {
      await helpDeskApi.removeTicket(this.ticketToDelete._id);
      this.getHelpDeskTickets();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>