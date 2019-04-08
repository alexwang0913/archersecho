/*=========================================================================================
  File Name: store.js
  Description: Vuex store
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Version: 1.1
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import state from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

import moduleAuth from "./auth/moduleAuth";
import moduleTodo from "./todo/moduleTodo.js";
import moduleArcher from "./archer/moduleArcher.js";
import moduleDevice from "./device/moduleDevice.js";

export default new Vuex.Store({
  getters,
  mutations,
  state,
  actions,
  modules: {
    auth: moduleAuth,
    todo: moduleTodo,
    archer: moduleArcher,
    device: moduleDevice
  },
  strict: process.env.NODE_ENV !== "production"
});
