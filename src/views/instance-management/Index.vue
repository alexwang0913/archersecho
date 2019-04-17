<template>
  <vs-card id="div-instance" class="vs-con-loading__container">
    <instance-add :archerId="archerId" @updateList="getInstanceList"></instance-add>

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
                icon="EyeIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="openDetailPage(tr)"
              ></feather-icon>

              <feather-icon
                icon="EditIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="openEditDialog(tr)"
              ></feather-icon>

              <feather-icon
                icon="TrashIcon"
                class="cursor-pointer"
                svgClasses="w-5 h-5 mr-4"
                @click="confirmDialog(tr)"
              ></feather-icon>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <instance-edit
      :displayPrompt="editDialogPrompt"
      :instance="instanceToEdit"
      @hidePrompt="hideEditDialog"
      v-if="editDialogPrompt"
    ></instance-edit>
  </vs-card>
</template>

<script>
import InstanceAdd from "./InstanceAdd.vue";
import InstanceEdit from "./InstanceEdit.vue";
import archerApi from "../../api/archer";
import { saveToStorage } from "../../utils";

export default {
  components: {
    InstanceAdd,
    InstanceEdit
  },
  data() {
    return {
      archerId: this.$route.params.id,
      instances: [],
      editDialogPrompt: false,
      instanceToEdit: {},
      instanceToDelete: {}
    };
  },
  mounted() {
    this.getInstanceList();
  },
  methods: {
    async getInstanceList() {
      console.log("Get instance list");
      this.$vs.loading({
        container: "#div-instance",
        scale: 0.6
      });
      this.instances = await archerApi.getInstances(this.archerId);
      this.$vs.loading.close("#div-instance > .con-vs-loading");
    },
    openEditDialog(instance) {
      this.instanceToEdit = instance;
      this.editDialogPrompt = true;
    },
    hideEditDialog() {
      this.editDialogPrompt = false;
      setTimeout(() => {
        this.getInstanceList();
      }, 500);
    },
    confirmDialog(instance) {
      this.instanceToDelete = instance;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm`,
        text: "Are you sure delete this instance?",
        accept: this.deleteInstance
      });
    },
    async deleteInstance() {
      await archerApi.removeInstance({
        instanceId: this.instanceToDelete._id
      });
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in remove instance"
      });
      this.getInstanceList();
    },
    openDetailPage(instance) {
      saveToStorage("archerId", this.archerId);
      this.$router.push({ path: `/instance-detail/${instance.database}` });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>