<template>
  <vx-card>
    <form-wizard
      color="rgba(var(--vs-primary), 1)"
      errorColor="rgba(var(--vs-danger), 1)"
      :title="null"
      :subtitle="null"
      finishButtonText="Submit"
      ref="wizard"
    >
      <tab-content
        title="Archer"
        class="mb-5"
        icon="feather icon-home"
        :before-change="validateStep1"
      >
        <!-- tab 1 content -->
        <form data-vv-scope="step-1">
          <div class="vx-row">
            <div class="vx-col w-1/2 mt-5">
              <vs-input
                size="large"
                label="Archer Name"
                v-model="archerName"
                class="w-full"
                name="archer_name"
                v-validate="'required'"
              />
              <span class="text-danger">{{ errors.first('step-1.archer_name') }}</span>
            </div>
          </div>
        </form>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content
        title="Instance"
        class="mb-5"
        icon="feather icon-briefcase"
        :before-change="validateStep2"
      >
        <vs-button @click="instancePrompt = true" icon="add" class="mb-4">Add Instance</vs-button>
        <vs-prompt
          vs-title="Add Instance"
          vs-accept-text="Add Instance"
          vs-button-cancel="border"
          @vs-cancel="clearInstanceFields"
          @vs-accept="addInstance"
          @vs-close="clearInstanceFields"
          :vs-is-valid="validateInstanceForm"
          :vs-active.sync="instancePrompt"
        >
          <div>
            <form>
              <div class="vx-row">
                <div class="vx-col w-full">
                  <vs-input
                    v-validate="'required'"
                    class="w-full mb-4 mt-5"
                    placeholder="Name"
                    v-model="instance.name"
                    :color="instance.name != '' ? 'success' : 'danger'"
                  />
                  <vs-input
                    v-validate="'required'"
                    class="w-full mb-4 mt-5"
                    placeholder="Database"
                    v-model="instance.database"
                    :color="instance.database != '' ? 'success' : 'danger'"
                  />

                  <vs-textarea rows="5" label="Add description" v-model="instance.description"/>
                </div>
              </div>
            </form>
          </div>
        </vs-prompt>
        <vs-table :data="instances">
          <template slot="thead">
            <vs-th>Name</vs-th>
            <vs-th>Database</vs-th>
            <vs-th>Description</vs-th>
            <vs-th></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{ tr.name }}</vs-td>
              <vs-td>{{ tr.database }}</vs-td>
              <vs-td>{{ tr.description }}</vs-td>

              <vs-td>
                <div class="vx-row">
                  <feather-icon
                    icon="TrashIcon"
                    class="cursor-pointer"
                    svgClasses="w-5 h-5 mr-4"
                    @click="confirmInstanceDialog(indextr)"
                  ></feather-icon>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content
        title="Device"
        class="mb-5"
        icon="feather icon-image"
        :before-change="validateStep3"
      >
        <vs-button @click="devicePrompt = true" icon="add" class="mb-4">Add Device</vs-button>
        <vs-prompt
          vs-title="Add Device"
          vs-accept-text="Add Device"
          vs-button-cancel="border"
          @vs-cancel="clearDeviceFields"
          @vs-accept="addDevice"
          @vs-close="clearDeviceFields"
          :vs-is-valid="validateDeviceForm"
          :vs-active.sync="devicePrompt"
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
                    v-model="device.name"
                    :color="this.device.name ? 'success' : 'danger'"
                  />
                  <p>Category</p>
                  <ul>
                    <li v-for="(item, index) in deviceCategories" :key="index">
                      <vs-checkbox v-model="device.category" :vs-value="item.value">{{item.text}}</vs-checkbox>
                    </li>
                  </ul>
                </div>
              </div>
            </form>
          </div>
        </vs-prompt>
        <vs-table :data="devices">
          <template slot="thead">
            <vs-th>Name</vs-th>
            <vs-th>Category</vs-th>
            <vs-th></vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>{{ tr.name }}</vs-td>
              <vs-td>
                <vs-chip v-for="(category, index) in tr.category" :key="index">
                  <div
                    class="h-2 w-2 rounded-full mr-1"
                    :class="'bg-' + getCategoryColor(category)"
                  ></div>
                  <span>{{getCategoryLabel(category)}}</span>
                </vs-chip>
              </vs-td>
              <vs-td>
                <div class="vx-row">
                  <feather-icon
                    icon="TrashIcon"
                    class="cursor-pointer"
                    svgClasses="w-5 h-5 mr-4"
                    @click="confirmDeviceDialog(indextr)"
                  ></feather-icon>
                </div>
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </tab-content>
    </form-wizard>
  </vx-card>
</template>

<script>
import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

// For custom error message
import { Validator } from "vee-validate";
const dict = {
  custom: {
    archer_name: {
      required: "Archer name is required"
    }
  }
};

// register custom messages
Validator.localize("en", dict);

import io from "socket.io-client";
import { SERVER_URL } from "../../utils/constant";
import { getFromStorage } from "../../utils";

export default {
  data() {
    return {
      archerName: "",
      instancePrompt: false,
      instance: {
        name: "",
        database: ""
      },
      instances: [],
      instanceIdToDelete: -1,
      deviceCategories: [
        { text: "Web Server", value: 1 },
        { text: "Services Server", value: 2 },
        { text: "Database Server", value: 3 },
        { text: "Other", value: 4 }
      ],
      devicePrompt: false,
      device: {
        name: "",
        category: []
      },
      devices: [],
      deviceIdToDelete: -1,
      socket: io(SERVER_URL)
    };
  },
  mounted() {
    this.responseSocket();
  },
  methods: {
    validateStep1() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll("step-1").then(result => {
          if (result) {
            resolve(true);
          } else {
            reject("correct all values");
          }
        });
      });
    },
    validateStep2() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll("step-2").then(result => {
          if (result) {
            resolve(true);
          } else {
            reject("correct all values");
          }
        });
      });
    },
    validateStep3() {
      return new Promise(resolve => {
        const data = {
          archerName: this.archerName,
          devices: this.devices,
          instances: this.instances,
          userId: getFromStorage("user").id
        };

        this.socket.emit("REQ_PUBLISH_ENROLLMENT", data);
        resolve(true);
      });
    },
    addInstance() {
      this.instances.push(this.instance);
      this.clearInstanceFields();
    },
    clearInstanceFields() {
      this.instance = {};
    },
    confirmInstanceDialog(index) {
      this.instanceIdToDelete = index;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this instance?",
        accept: this.removeInstance
      });
    },
    removeInstance() {
      let tmpArray = [];

      this.instances.forEach((instance, index) => {
        if (index !== this.instanceIdToDelete) {
          tmpArray.push(instance);
        }
      });
      this.instances = tmpArray;
    },
    clearDeviceFields() {
      this.device = {
        name: "",
        category: []
      };
    },
    addDevice() {
      this.devices.push(this.device);
      this.clearDeviceFields();
    },
    getCategoryColor(category) {
      category = parseInt(category);
      if (category === 1) {
        return "primary";
      } else if (category === 2) {
        return "success";
      } else if (category === 3) {
        return "warning";
      }
      return "danger";
    },
    getCategoryLabel(category) {
      category = parseInt(category);
      if (category === 1) {
        return "WebServer";
      } else if (category === 2) {
        return "Services Server";
      } else if (category === 3) {
        return "Database Server";
      }
      return "Other";
    },
    confirmDeviceDialog(index) {
      this.deviceIdToDelete = index;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this device?",
        accept: this.removeDevice
      });
    },
    removeDevice() {
      let tmpArray = [];

      this.devices.forEach((device, index) => {
        if (index !== this.deviceIdToDelete) {
          tmpArray.push(device);
        }
      });
      this.devices = tmpArray;
    },
    responseSocket() {
      this.socket.on("connect", () => {
        this.socket.emit("REQ_USER_CONNECTED", getFromStorage("user").id);
      });
      this.socket.on("RES_PUBLISH_ENROLLMENT", () => {
        this.$vs.notify({
          color: "success",
          title: "Success",
          text: "Successfully added!"
        });
        this.$refs.wizard.reset();
        this.archerName = "";
        this.devices = [];
        this.instances = [];
        this.$store.dispatch("archer/getArcherList", getFromStorage("user").id);
      });
    }
  },
  computed: {
    validateInstanceForm() {
      return this.instance.name != "" && this.instance.database != "";
    },
    validateDeviceForm() {
      return this.device.name != "" && this.device.category.length > 0;
    }
  },
  components: {
    FormWizard,
    TabContent
  }
};
</script>