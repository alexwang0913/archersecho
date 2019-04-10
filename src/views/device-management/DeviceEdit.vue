<template>
  <vs-prompt
    vs-title="Update Device"
    vs-accept-text="Update Device"
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
              name="title"
              class="w-full mb-4 mt-5"
              placeholder="Name"
              v-model="name"
              :color="this.name ? 'success' : 'danger'"
            />
            <p>Category</p>
            <ul>
              <li v-for="(item, index) in categories" :key="index">
                <vs-checkbox v-model="category" :vs-value="item.value">{{item.text}}</vs-checkbox>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  </vs-prompt>
</template>

<script>
import deviceApi from "../../api/device";
export default {
  props: {
    displayPrompt: {
      type: Boolean,
      required: true
    },
    device: { type: Object, required: true }
  },
  computed: {
    activePrompt: {
      get() {
        return this.displayPrompt;
      },
      set(value) {
        this.$emit("hideEditPrompt", value);
      }
    }
  },
  data() {
    return {
      name: this.device.name,
      categories: [
        { text: "Web Server", value: "1" },
        { text: "Services Server", value: "2" },
        { text: "Database Server", value: "3" },
        { text: "Other", value: "4" }
      ],
      category: this.device.type.split(",")
    };
  },
  mounted() {
    console.log(this.device.type.split(","));
  },
  methods: {
    clearFields() {
      this.name = "";
    },
    validateForm() {
      return !this.errors.any() && this.name != "" && this.category.length > 0;
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.updateDevice();
      });
    },
    async updateDevice() {
      await deviceApi.updateDetail({
        id: this.device.id,
        name: this.name,
        deviceType: this.category
      });
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "success in update device information"
      });
      this.$store.dispatch("device/getDevicesByArcherId", this.device.archerId);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>