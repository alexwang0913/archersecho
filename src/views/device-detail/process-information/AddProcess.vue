<template>
  <div class="mb-4">
    <vs-button icon="add" @click="activePrompt = true">Add process</vs-button>
    <vs-prompt
      vs-title="Add Process"
      vs-accept-text="Add Process"
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
                :color="validateForm ? 'success' : 'danger'"
              />
            </div>
          </div>
        </form>
      </div>
    </vs-prompt>
  </div>
</template>

<script>
import deviceApi from "../../../api/device";
export default {
  props: ["deviceId"],
  data() {
    return {
      activePrompt: false,
      name: ""
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.name != "";
    }
  },
  methods: {
    submit() {
      console.log("asdfasdf");
      this.$validator.validateAll().then(result => {
        if (result) this.addProcess();
      });
    },
    clearFields() {
      this.name = "";
      this.desc = "";
    },
    async addProcess() {
      const data = {
        deviceId: this.deviceId,
        name: this.name
      };
      console.log(data);
      await deviceApi.addProcess(data);
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in add process"
      });
    }
  }
};
</script>

<style scoped>
</style>