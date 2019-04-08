<template>
  <div class="px-6 pb-2 pt-6">
    <vs-button @click="activePrompt = true" icon="add">Add Device</vs-button>

    <vs-prompt
      vs-title="Add Device"
      vs-accept-text="Add Device"
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
  </div>
</template>

<script>
import deviceApi from "../../api/device";
import { getFromStorage } from "../../utils";

export default {
  props: ["archerId"],
  data() {
    return {
      activePrompt: false,

      name: "",
      category: [],

      categories: [
        { text: "Web Server", value: 1 },
        { text: "Services Server", value: 2 },
        { text: "Database Server", value: 3 },
        { text: "Other", value: 4 }
      ]
    };
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.name != "" && this.category.length > 0;
    },
    localUser() {
      return getFromStorage("user");
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) this.addDevice();
      });
    },
    clearFields() {
      this.name = "";
      this.category = [];
    },
    async addDevice() {
      const data = {
        name: this.name,
        deviceType: this.category,
        archerId: this.archerId
      };
      console.log(data);
      await deviceApi.addDevice(data);
      this.$vs.notify({
        color: "success",
        title: "Add success",
        text: "Success in add device"
      });
      this.$store.dispatch("device/getDevicesByArcherId", this.archerId);
      this.clearFields();
    }
  }
};
</script>

<style scoped>
</style>