<template>
  <div class="vx-row">
    <div class="vx-col w-full lg:w-1/2 vs-con-loading__container" id="div-loading">
      <vx-card title="Detail">
        <vs-row>
          <vs-col class="mb-4">
            <vs-input label-placeholder="Name" v-model="user.name"></vs-input>
          </vs-col>
          <vs-col class="mb-4">
            <vs-input label-placeholder="User Id" v-model="user.userId"></vs-input>
          </vs-col>
          <vs-col class="mb-4">
            <div v-if="!editProfileImage">
              <vs-avatar size="150px" :src="`http://archersecho.com/${user.profileUrl}`"></vs-avatar>
              <span style="cursor: pointer" @click="editProfileImage = true">edit</span>
            </div>

            <vs-upload
              action="http://archersecho.com/api/upload"
              text="Upload profile image"
              fileName="file"
              @on-success="successUpload"
              @on-error="failUpload"
              v-else
            />
          </vs-col>
          <vs-col vs-offset="8" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <vs-button @click="updateDetail">Save</vs-button>
          </vs-col>
        </vs-row>
      </vx-card>
    </div>
    <div class="vx-col w-full lg:w-1/2">
      <vx-card title="Update Password">
        <vs-row>
          <vs-col class="mb-4">
            <vs-input label-placeholder="Old Password" type="password" v-model="oldPassword"></vs-input>
          </vs-col>
          <vs-col class="mb-4">
            <vs-input label-placeholder="New Password" type="password" v-model="newPassword"></vs-input>
          </vs-col>
          <vs-col class="mb-4">
            <vs-input
              label-placeholder="Confirm Password"
              type="password"
              v-model="confirmPassword"
            ></vs-input>
          </vs-col>
          <vs-col vs-offset="8" vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
            <vs-button @click="updatePassword">Save</vs-button>
          </vs-col>
        </vs-row>
      </vx-card>
    </div>
  </div>
</template>

<script>
import userApi from "../../api/user";
import { getFromStorage } from "../../utils";
export default {
  data() {
    return {
      user: {},
      editProfileImage: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    successUpload(response) {
      this.user.profileUrl = response.srcElement.response;
    },
    failUpload(error) {
      console.log(error);
    },
    async updateDetail() {
      await userApi.update(getFromStorage("user").id, this.user);
      this.$vs.notify({
        color: "success",
        title: "Success",
        text: "Success in update profile"
      });
    },
    async getProfile() {
      this.$vs.loading({ container: "#div-loading" });
      this.user = await userApi.getById(getFromStorage("user").id);
      console.log(this.user);
      this.$vs.loading.close("#div-loading > .con-vs-loading");
    },
    async updatePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.$vs.notify({
          color: "danger",
          title: "Error",
          text: "Confirm password is incorrect"
        });
        return;
      }
      try {
        await userApi.updatePassword({
          id: getFromStorage("user").id,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        });

        this.$vs.notify({
          color: "success",
          title: "Success",
          text: "Success in update password"
        });
      } catch (err) {
        this.$vs.notify({
          color: "danger",
          title: "Failed",
          text: "Failed in update password"
        });
      }

      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    }
  }
};
</script>

<style lang="scss" scoped>
</style>