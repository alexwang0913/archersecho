<template>
  <vs-prompt
    vs-title="Update Process"
    vs-accept-text="Update Process"
    vs-button-cancel="border"
    @vs-cancel="clearFields"
    @vs-accept="submit"
    @vs-close="clearFields"
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
</template>

<script>
import deviceApi from "../../../api/device";
export default {
  props: {
    displayPrompt: {
      type: Boolean,
      required: true
    },
    processItemId: {
      type: Number,
      required: true
    },
    deviceId: { type: String }
  },
  computed: {
    activePrompt: {
      get() {
        return this.displayPrompt;
      },
      set(value) {
        this.$emit("hideDisplayPrompt", value);
      }
    }
  },
  data() {
    return {
      name: this.$store.state.device.processList[this.processItemId].Name
    };
  },
  methods: {
    clearFields() {
      this.name = "";
    },
    validateForm() {
      return this.name != "";
    },
    async submit() {
      const data = {
        processId: this.$store.state.device.processList[this.processItemId]._id,
        processName: this.name
      };
      await deviceApi.updateProcess(data);
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in add process"
      });
      this.$store.dispatch("device/getProcessList", this.deviceId);
      this.name = "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>