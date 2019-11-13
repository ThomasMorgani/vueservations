import Vue from "vue";
import App from "./App.vue";
import store from "./store"; //vuex
import vuetify from "./plugins/vuetify";

import axios from "axios";
import VueAxios from "vue-axios";

import vueTextAreaAutosize from "vue-textarea-autosize";

import { apiSettings, firebaseSettings } from "./.env.local";

import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({ ...firebaseSettings });
export const db = firebase.firestore();

Vue.prototype.$apiSettings = apiSettings;

Vue.use(VueAxios, axios);
Vue.use(vueTextAreaAutosize);

Vue.config.productionTip = false;
new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount("#app");
