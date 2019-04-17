<template>
  <div>
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card>
      <vs-row>
        <vs-col class="mb-4">
          <span>Ticket name:</span>
          <span class="ml-2 font-semibold">{{ticket.name}}</span>
        </vs-col>
        <vs-col class="mb-4">
          <div v-html="ticket.description" style="border: solid 1px;padding: 2px"></div>
        </vs-col>
        <vs-col class="mb-4">
          <vs-list-header title="Assigned Members" color="danger"></vs-list-header>

          <vs-list-item
            v-for="(item, index) in ticket.assignedTo"
            :title="item.userId"
            :key="index"
          >
            <template slot="avatar">
              <vs-avatar/>
            </template>
          </vs-list-item>
        </vs-col>
        <vs-col>
          <span>Status:</span>
          <span class="ml-2 font-semibold">{{getStatusLabel(ticket.status)}}</span>
        </vs-col>
      </vs-row>
    </vx-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
import helpDeskApi from "../../api/helpDesk";
import teamApi from "../../api/team";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {
      id: this.$route.params.id,
      ticket: {},
      teamMembers: []
    };
  },
  components: {
    quillEditor
  },
  mounted() {
    this.getMyTeamMembers();
    this.getTicketInfo();
  },
  methods: {
    async getMyTeamMembers() {
      const teamMembers = await teamApi.getMemberList(
        getFromStorage("user").id
      );

      for (const member of teamMembers) {
        this.teamMembers.push({
          value: member.id._id,
          text: member.id.userId
        });
      }
    },
    async getTicketInfo() {
      this.ticket = await helpDeskApi.getInfo(this.id);
    },
    async update() {
      await helpDeskApi.update(this.id, this.ticket);
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in update HelpDeskTicket"
      });
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