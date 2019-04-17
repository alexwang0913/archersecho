<template>
  <div>
    <vs-button @click="$router.go(-1)" type="flat" icon="arrow_back">back</vs-button>
    <vx-card title="Add team">
      <div class="vx-row">
        <div class="vx-col w-full">
          <vs-input
            v-validate="'required'"
            class="w-full mb-4 mt-5"
            placeholder="Name"
            v-model="name"
            :color="name != '' ? 'success' : 'danger'"
          />
          <vs-chips color="rgb(145, 32, 159)" placeholder="Team members" v-model="members">
            <vs-chip :key="idx" @click="remove(member)" v-for="(member, idx) in members" closable>
              <vs-avatar/>
              {{ member }}
            </vs-chip>
          </vs-chips>
        </div>
        <vs-col vs-offset="10" vs-w="2" class="mt-4">
          <vs-button icon="add" @click="addTeam" :disabled="!validateForm">Add</vs-button>
        </vs-col>
      </div>
    </vx-card>
  </div>
</template>

<script>
import teamApi from "../../api/team";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {
      members: [],
      name: ""
    };
  },
  computed: {
    validateForm() {
      return this.name != "" && this.members.length > 0;
    }
  },
  methods: {
    remove(item) {
      this.members.splice(this.members.indexOf(item), 1);
    },
    async addTeam() {
      await teamApi.addTeam({
        name: this.name,
        members: this.members,
        userId: getFromStorage("user").id
      });
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in add team"
      });
      this.clearForm();
    },
    clearForm() {
      this.name = "";
      this.members = [];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>