<template>
  <div class="px-6 pb-2 pt-6">
    <vs-button @click="openDialog" icon="add">Add Archer</vs-button>
    <vs-prompt
      vs-title="Add Archer"
      vs-accept-text="Add Archer"
      vs-button-cancel="border"
      @vs-cancel="clearFields"
      @vs-accept="submit"
      @vs-close="clearFields"
      :vs-is-valid="validateForm"
      :vs-active.sync="activePrompt"
    >
      <div>
        <form>
          <div class="vx-row">
            <div class="vx-col w-full">
              <vs-input
                v-validate="'required'"
                name="title"
                class="w-full mb-4 mt-5"
                placeholder="Name"
                v-model="name"
                :color="validateForm ? 'success' : 'danger'"
              />
              <vs-textarea rows="5" label="Add description" v-model="desc"/>
            </div>
          </div>
        </form>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import archerApi from "../../api/archer";
import { getFromStorage } from "../../utils";

export default {
  data() {
    return {
      activePrompt: false,
      //Add archer fields
      name: "",
      desc: ""
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.title != "";
    },
    localUser() {
      return getFromStorage("user");
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.addArcher();
      });
    },
    clearFields() {
      this.name = "";
      this.desc = "";
      this.$store.commit("archer/SET_ARCHER_DIALOG_STATUS", false);
    },
    async addArcher() {
      await archerApi.add({
        name: this.name,
        userId: this.localUser.id,
        description: this.desc
      });
      this.$vs.notify({
        color: "success",
        title: "Add success",
        text: "Success in add archer"
      });
      this.$store.dispatch("archer/getArcherList", this.localUser.id);
      this.clearFields();
    },
    openDialog() {
      this.activePrompt = true;
      // this.$store.commit("archer/SET_ARCHER_DIALOG_STATUS", true);
    }
  }
};
</script>

<style scoped>
</style>