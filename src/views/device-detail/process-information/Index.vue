<template>
  <vx-card title="Process information" class="mt-4">
    <add-process :deviceId="id"></add-process>
    <vs-table :data="process">
      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Last update time</vs-th>
        <vs-th>Enable / Disable</vs-th>
        <vs-th></vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in process">
          <vs-td>{{ tr.Name }}</vs-td>

          <vs-td>
            <vs-chip :color="getStatusColor(tr.Status)">{{ tr.Status ? "On" : "Off" }}</vs-chip>
          </vs-td>

          <vs-td>{{ getUpdateAt(tr.updateAt) }}</vs-td>
          <vs-td>
            <vs-switch color="success" v-model="tr.isActive" @click="updateProcessStatus(tr)"/>
          </vs-td>
          <vs-td>
            <div class="vx-row">
              <vs-button
                color="primary"
                type="border"
                icon="edit"
                radius
                size="small"
                class="mr-2"
                @click="showPrompt(indextr)"
              ></vs-button>
              <vs-button
                color="danger"
                type="border"
                icon="delete"
                radius
                size="small"
                @click="openConfirmDialog(tr._id)"
              ></vs-button>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <edit-process
      :displayPrompt="displayPrompt"
      :processItemId="processIdToEdit"
      :deviceId="id"
      @hideDisplayPrompt="hidePrompt"
      v-if="displayPrompt"
    ></edit-process>
  </vx-card>
</template>

<script>
import { mapState } from "vuex";
import AddProcess from "./AddProcess.vue";
import EditProcess from "./EditProcess.vue";
import deviceApi from "../../../api/device";

export default {
  props: ["id"],
  components: {
    AddProcess,
    EditProcess
  },
  computed: {
    ...mapState({
      process: state => state.device.processList
    })
  },
  data() {
    return {
      displayPrompt: false,
      processIdToEdit: 0,
      selectProcessId: null,
      timer: null
    };
  },
  mounted() {
    this.$store.dispatch("device/getProcessList", this.id);
    this.timer = setInterval(() => {
      this.$store.dispatch("device/getProcessList", this.id);
    }, 1000 * 10);
  },
  methods: {
    getUpdateAt(value) {
      return value ? value.replace("T", " ").split(".")[0] : "--";
    },
    getStatusColor(status) {
      return status ? "success" : "danger";
    },
    hidePrompt() {
      this.displayPrompt = false;
    },
    showPrompt(index) {
      this.processIdToEdit = index;
      this.displayPrompt = true;
    },
    openConfirmDialog(id) {
      this.selectProcessId = id;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this process?",
        accept: this.deleteProcess
      });
    },
    async deleteProcess() {
      await deviceApi.deleteProcess({
        deviceId: this.id,
        processId: this.selectProcessId
      });
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in delete process"
      });
      this.$store.dispatch("device/getProcessList", this.id);
    },
    async updateProcessStatus(process) {
      console.log(process);
      await deviceApi.updateProcessStatus({
        processId: process._id,
        status: !process.isActive
      });
      this.$vs.notify({
        type: "success",
        title: "Success",
        text: "Success in update process status"
      });
      this.$store.dispatch("device/getProcessList", this.id);
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>

<style scoped>
</style>