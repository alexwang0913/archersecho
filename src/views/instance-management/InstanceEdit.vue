<template>
  <vs-prompt
    vs-title="Edit Instance"
    vs-accept-text="Update Instance"
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
</template>

<script>
import archerApi from "../../api/archer";
export default {
  props: ["displayPrompt", "instance"],
  data() {
    return {
      name: this.instance.name,
      database: this.instance.database,
      desc: this.instance.description
    };
  },
  computed: {
    activePrompt: {
      get() {
        return this.displayPrompt;
      },
      set(value) {
        this.$emit("hidePrompt", value);
      }
    },
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
        if (result) this.updateInstance();
      });
    },
    async updateInstance() {
      await archerApi.updateInstance({
        id: this.instance._id,
        name: this.name,
        database: this.database,
        description: this.desc
      });
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in update instance"
      });
      this.clearFields();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>