<!-- =========================================================================================
	File Name: Login.vue
	Description: Login Page
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img vs-con-loading__container" id="div-loading">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center bg-white">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Login</h4>
                  <p>Welcome back, please login to your account.</p>
                </div>
                <vs-input
                  icon="icon icon-user"
                  icon-pack="feather"
                  label-placeholder="Username"
                  v-model="user.userId"
                  class="w-full mb-6 no-icon-border"
                  :danger="validate.username"
                  danger-text="Username required"
                />
                <vs-input
                  type="password"
                  icon="icon icon-lock"
                  icon-pack="feather"
                  label-placeholder="Password"
                  v-model="user.password"
                  class="w-full mb-4 no-icon-border"
                  :danger="validate.password"
                  danger-text="Password required."
                />
                <div class="flex flex-wrap justify-between my-5">
                  <vs-checkbox v-model="checkBox1" class="mb-3">Remember Me</vs-checkbox>
                  <router-link to="/pages/forgot-password">Forgot Password?</router-link>
                </div>

                <div v-if="loginFail">
                  <vs-alert
                    class="mb-6"
                    color="danger"
                    title="Danger"
                    active="true"
                    v-if="failType === 1"
                  >
                    Username or password is incorrect.
                    <br>
                    {{remainCount}} times remaing
                  </vs-alert>
                  <vs-alert
                    class="mb-6"
                    color="danger"
                    title="Danger"
                    active="true"
                    v-if="failType === 2"
                  >
                    You failed 3 times.
                    <br>You can try again after 15mins.
                  </vs-alert>
                  <vs-alert
                    class="mb-6"
                    color="danger"
                    title="Danger"
                    active="true"
                    v-if="failType === 3"
                  >This user is not activated.</vs-alert>
                </div>
                <vs-button type="border" to="/register">Register</vs-button>
                <vs-button class="float-right" @click="onClickLogin">Login</vs-button>

                <vs-divider position="center" class="my-8"></vs-divider>

                <div class="social-login mb-4 flex flex-wrap justify-between">
                  <span>Or Login With</span>
                  <div class="social-login-buttons flex">
                    <!-- <vs-button
                      color="#1551b1"
                      class="mr-4 px-8"
                      icon="icon icon-facebook"
                      icon-pack="feather"
                    ></vs-button>
                    <vs-button
                      color="#00aaff"
                      class="mr-4 px-8"
                      icon="icon icon-twitter"
                      icon-pack="feather"
                    ></vs-button>-->
                    <vs-button color="success" class="px-8" @click="getGoogleAuth">
                      <font-awesome-icon :icon="['fab', 'google']"></font-awesome-icon>
                    </vs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import authApi from "../../api/auth";
import axios from "axios";
import { saveToStorage } from "../../utils";
export default {
  data() {
    return {
      value1: "",
      value2: "",
      checkBox1: false,
      user: {},
      validate: {},
      loginFail: false,
      failType: 0,
      remainCount: 0
    };
  },
  methods: {
    getGoogleAuth() {
      axios
        .get("http://localhost:3000/api/auth/google/login")
        .then(response => {
          console.log("__response");
          console.log(response);
          console.log(response.data);

          window.open(response.data);
        })
        .catch(err => {
          console.log("__error");
          console.log(err);
        });
      // console.log("__Google auth");
    },
    async onClickLogin() {
      if (!this.validateForm()) return;
      this.$vs.loading({
        container: "#div-loading",
        scale: 0.6
      });
      try {
        const { status, data, attemptCount } = await authApi.login(this.user);
        console.log(status);
        console.log(data);
        this.$vs.loading.close("#div-loading > .con-vs-loading");

        if (status === 301) {
          this.loginFail = true;
          this.remainCount = 3 - attemptCount;
          this.failType = 1;
        } else if (status === 300) {
          this.loginFail = true;
          this.failType = 2;
        } else if (status === 200) {
          if (!data.isActive) {
            this.loginFail = true;
            this.failType = 3;
          } else {
            saveToStorage("user", {
              name: data.name,
              userId: data.userId,
              profileUrl: data.profileUrl,
              id: data._id
            });
            this.$store.commit("auth/SET_AUTH_STATE", true);
            this.$router.push({ name: "home" });
          }
        }
      } catch (err) {
        this.$vs.notify({
          color: "danger",
          title: "Failed",
          text: err.stack
        });
      }
    },
    validateForm() {
      this.validate = {};
      if (!this.user.userId || this.user.userId === "") {
        this.validate.username = true;
        return false;
      }
      if (!this.user.password || this.user.password === "") {
        this.validate.password = true;
        return false;
      }
      return true;
    }
  }
};
</script>