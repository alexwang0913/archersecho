<template>
  <div class="px-6 pb-2 pt-6">
    <vs-button @click="activePrompt = true" icon="add">Add Instance</vs-button>
    <vs-prompt
      vs-title="Add Instance"
      vs-accept-text="Add Instance"
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
                class="w-full mb-4 mt-5"
                placeholder="Name"
                v-model="name"
                :color="name != '' ? 'success' : 'danger'"
              />
              <vs-input
                v-validate="'required'"
                class="w-full mb-4 mt-5"
                placeholder="Database"
                v-model="database"
                :color="database != '' ? 'success' : 'danger'"
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
export default {
  props: ["archerId"],
  data() {
    return {
      activePrompt: false,
      name: "",
      database: "",
      desc: ""
    };
  },
  computed: {
    validateForm() {
      return (
        !this.errors.any() &&
        this.name != "" &&
        this.database != "" &&
        this.desc != ""
      );
    }
  },
  methods: {
    clearFields() {
      this.name = "";
      this.database = "";
      this.desc = "";
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.addInstance();
      });
    },
    async addInstance() {
      await archerApi.addInstance({
        archerId: this.archerId,
        name: this.name,
        database: this.database,
        description: this.desc
      });
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in add instance"
      });
      this.$emit("updateList");
      this.clearFields();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>