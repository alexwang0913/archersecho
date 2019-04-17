<template>
  <div>
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card>
      <vs-row>
        <vs-col class="mb-4">
          <vs-input class="mb-4" label-placeholder="HelpDesk Ticket Name" v-model="ticket.name"></vs-input>
          <quill-editor class="mb-4" id="editor" v-model="ticket.description"></quill-editor>

          <vs-select
            placeholder="Select members"
            class="selectExample"
            label="Assigned Members"
            label-placeholder="Assgiend Members"
            multiple
            autocomplete
            v-model="ticket.assignTo"
          >
            <vs-select-item
              :key="index"
              :value="item.value"
              :text="item.text"
              v-for="(item,index) in teamMembers"
            />
          </vs-select>
        </vs-col>
        <vs-col vs-offset="10" vs-type="flex" vs-w="2">
          <vs-button @click="save">Save</vs-button>
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
import { getFromStorage } from "../../utils";
import teamApi from "../../api/team";
import helpDeskApi from "../../api/helpDesk";

export default {
  data() {
    return {
      ticket: {
        name: "",
        description: "",
        creator: getFromStorage("user").id,
        assignTo: []
      },
      teamMembers: []
    };
  },
  components: {
    quillEditor
  },
  mounted() {
    this.getMyTeamMembers();
  },
  methods: {
    async getMyTeamMembers() {
      const teamMembers = await teamApi.getMemberList(
        getFromStorage("user").id
      );
      console.log(teamMembers);
      for (const member of teamMembers) {
        this.teamMembers.push({
          value: member.id._id,
          text: member.id.userId
        });
      }
      console.log(this.teamMembers);
    },
    async save() {
      await helpDeskApi.add(this.ticket);
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in add HelpDesk Ticket"
      });
      this.ticket = {
        creator: getFromStorage("user").id
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>