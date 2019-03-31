<!-- =========================================================================================
	File Name: Register.vue
	Description: Register Page
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Version: 1.1
	Author: Pixinvent
	Author URL: hhttp://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div class="h-screen flex w-full bg-img" id="div-register">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img src="@/assets/images/pages/register.jpg" alt="register" class="mx-auto">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center bg-white">
              <div class="p-8">
                <div class="vx-card__title">
                  <h4 class="mb-4">Create Account</h4>
                  <p>Fill the below form to create a new account.</p>
                </div>
                <div class="clearfix">
                  <vs-input
                    label-placeholder="Name"
                    placeholder="Name"
                    v-model="user.name"
                    class="w-full mb-6"
                    :danger="validate.name"
                    danger-text="Name is required."
                  />
                  <vs-input
                    label-placeholder="User Id"
                    placeholder="User Id"
                    v-model="user.userId"
                    class="w-full mb-6"
                    :danger="validate.userId"
                    danger-text="UserId is required."
                  />
                  <vs-input
                    label-placeholder="Company"
                    placeholder="Company"
                    v-model="user.company"
                    class="w-full mb-6"
                    :danger="validate.company"
                    danger-text="Company is required."
                  />
                  <vs-input
                    type="email"
                    label-placeholder="Email"
                    placeholder="Email"
                    v-model="user.email"
                    class="w-full mb-6"
                    :danger="validate.email"
                    danger-text="Email is required."
                  />
                  <h5>Password strength</h5>
                  <ul>
                    <li v-bind:class="{ is_valid: contains_eight_characters }">8 Characters</li>
                    <li v-bind:class="{ is_valid: contains_number }">Contains Number</li>
                    <li v-bind:class="{ is_valid: contains_uppercase }">Contains Uppercase</li>
                    <li
                      v-bind:class="{ is_valid: contains_special_character }"
                    >Contains Special Character</li>
                  </ul>
                  <vs-input
                    type="password"
                    label-placeholder="Password"
                    placeholder="Password"
                    v-model="user.password"
                    class="w-full mb-6"
                    @input="checkPassword"
                    :danger="validate.password"
                    danger-text="Password is required."
                  />
                  <vs-input
                    type="password"
                    label-placeholder="Confirm Password"
                    placeholder="Confirm Password"
                    v-model="user.confirmPassword"
                    class="w-full mb-6"
                    :danger="validate.confirmPassword"
                    danger-text="Confirm password is mot match."
                  />
                  <vs-upload
                    action="http://localhost:3000/api/upload"
                    text="Upload profile image"
                    fileName="file"
                    @on-success="successUpload"
                    @on-error="failUpload"
                  />
                  <vs-alert
                    class="mb-6"
                    color="danger"
                    title="Danger"
                    active="true"
                    v-if="validate.profileImage"
                  >Please select profile image</vs-alert>
                  <vs-checkbox
                    v-model="rule.isAccept"
                    class="mb-6"
                    v-for="(rule, idx) in rules"
                    :key="idx"
                  >{{rule.name}}</vs-checkbox>
                  <vs-alert
                    class="mb-6"
                    color="danger"
                    title="Danger"
                    active="true"
                    v-if="validate.rule"
                  >Please accept all rules.</vs-alert>
                  <vs-button type="border" to="/login">Login</vs-button>
                  <vs-button class="float-right" @click="onClickRegister">Register</vs-button>
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
import ruleApi from "../../api/rule";
import authApi from "../../api/auth";
export default {
  data() {
    return {
      password_length: 0,
      contains_eight_characters: false,
      contains_number: false,
      contains_uppercase: false,
      contains_special_character: false,
      user: {},
      rules: null,
      validate: {}
    };
  },
  mounted() {
    this.showLoading();
    this.getRuleList();
  },
  methods: {
    checkPassword() {
      this.password_length = this.user.password.length;
      // eslint-disable-next-line no-useless-escape
      const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

      if (this.password_length > 8) {
        this.contains_eight_characters = true;
      } else {
        this.contains_eight_characters = false;
      }

      this.contains_number = /\d/.test(this.user.password);
      this.contains_uppercase = /[A-Z]/.test(this.user.password);
      this.contains_special_character = format.test(this.user.password);

      if (
        this.contains_eight_characters === true &&
        this.contains_special_character === true &&
        this.contains_uppercase === true &&
        this.contains_number === true
      ) {
        this.valid_password = true;
      } else {
        this.valid_password = false;
      }
    },
    successUpload(response) {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Success in upload profile image"
      });

      const { url } = JSON.parse(response.srcElement.response);
      this.user.profileUrl = url;
    },
    failUpload(error) {
      console.log(error);
    },
    async getRuleList() {
      this.rules = await ruleApi.list();
      this.hideLoading();
    },
    async onClickRegister() {
      if (!this.validateForm()) return;

      await authApi.signUp(this.user);
      this.$vs.notify({
        color: "success",
        title: "Register succes",
        text: "Success in register"
      });
      this.user = {};
      this.contains_eight_characters = false;
      this.contains_number = false;
      this.contains_uppercase = false;
      this.contains_special_character = false;
      for (const rule of this.rules) {
        rule.isAccept = false;
      }
    },
    showLoading() {
      this.$vs.loading({
        container: "#div-register",
        scale: 0.6
      });
    },
    hideLoading() {
      this.$vs.loading.close("#div-register > .con-vs-loading");
    },
    validateForm() {
      this.validate = {};
      if (!this.user.name || this.user.name === "") {
        this.validate.name = true;
        return false;
      }
      if (!this.user.userId || this.user.userId === "") {
        this.validate.userId = true;
        return false;
      }
      if (!this.user.company || this.user.company === "") {
        this.validate.company = true;
        return false;
      }
      if (!this.user.email || this.user.email === "") {
        this.validate.email = true;
        return false;
      }
      if (!this.user.password || this.user.password === "") {
        this.validate.password = true;
        return false;
      }
      if (this.user.password !== this.user.confirmPassword) {
        this.validate.confirmPassword = true;
        return false;
      }
      if (!this.user.profileUrl || this.user.profileUrl === "") {
        this.validate.profileImage = true;
        return false;
      }
      let validateRule = true;
      for (const rule of this.rules) {
        if (!rule.isAccept) {
          validateRule = false;
        }
      }
      if (!validateRule) {
        this.validate.rule = true;
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>
ul {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

li {
  margin-bottom: 8px;
  color: #525f7f;
  position: relative;
}

li:before {
  content: "";
  width: 0%;
  height: 2px;
  background: #2ecc71;
  position: absolute;
  left: 0;
  top: 50%;
  display: block;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Password Input --------- */

.input_container {
  position: relative;
  padding: 30px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  border-radius: 6px;
  background: #fff;
}

input[type="password"] {
  line-height: 1.5;
  display: block;
  color: rgba(136, 152, 170, 1);
  font-weight: 300;

  height: calc(2.75rem + 2px);
  padding: 0.625rem 0.75rem;
  border-radius: 0.25rem;
  background-color: #fff;
  transition: border-color 0.4s ease;
  border: 1px solid #cad1d7;
  outline: 0;
}

input[type="password"]:focus {
  border-color: rgba(50, 151, 211, 0.45);
}

/* Checkmark & Strikethrough --------- */

.is_valid {
  color: rgba(136, 152, 170, 0.8);
}
.is_valid:before {
  width: 100%;
}

.checkmark_container {
  border-radius: 50%;

  top: -15px;
  right: -15px;
  background: #2ecc71;
  width: 50px;
  height: 50px;
  visibility: hidden;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.4s ease;
}

.show_checkmark {
  visibility: visible;
  opacity: 1;
}

.checkmark {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: white;
  stroke-width: 15;
  stroke-linecap: round;
  stroke-dasharray: 180;
  stroke-dashoffset: 180;
}

.checked {
  animation: draw 0.5s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
pre {
  width: 100%;
  color: rgba(255, 255, 255, 0.8);
}
</style>
