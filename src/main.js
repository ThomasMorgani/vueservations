import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import vueTextAreaAutosize from 'vue-textarea-autosize'

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

import firebase from 'firebase/app'
import 'firebase/firestore'
import store from './store'

Vue.use(vueTextAreaAutosize)

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: 'AIzaSyBA4yqiF_8hpxmOjmDjvThTfUfjPtXTw1s',
  authDomain: 'vueservation.firebaseapp.com',
  databaseURL: 'https://vueservation.firebaseio.com',
  projectId: 'vueservation',
  storageBucket: 'vueservation.appspot.com',
  messagingSenderId: '331265235328',
  appId: '1:331265235328:web:20a27e13567bf594154965',
  measurementId: 'G-ML4Z9XXW1Q'
})

export const db = firebase.firestore()

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
