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
  <div class="h-screen flex w-full bg-img">
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
                  v-model="value1"
                  class="w-full mb-6 no-icon-border"
                />
                <vs-input
                  type="password"
                  icon="icon icon-lock"
                  icon-pack="feather"
                  label-placeholder="Password"
                  v-model="value2"
                  class="w-full mb-4 no-icon-border"
                />
                <div class="flex flex-wrap justify-between my-5">
                  <vs-checkbox v-model="checkBox1" class="mb-3">Remember Me</vs-checkbox>
                  <router-link to="/pages/forgot-password">Forgot Password?</router-link>
                </div>
                <vs-button type="border" to="/pages/register">Register</vs-button>
                <vs-button class="float-right" to="/">Login</vs-button>

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
import axios from "axios";
export default {
  data() {
    return {
      value1: "",
      value2: "",
      checkBox1: false
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
    }
  }
};
</script>