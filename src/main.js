import Vue from 'vue'
import App from './App.vue'
import store from './store' //vuex
import vuetify from './plugins/vuetify'
import { Table, TableColumn } from 'element-ui'

import axios from 'axios'
import VueAxios from 'vue-axios'

// import { apiSettings, firebaseSettings } from './.env.local.js'
import { apiSettings } from './.env.local.js'

// import firebase from 'firebase/app'
// import 'firebase/firestore'

// firebase.initializeApp({ ...firebaseSettings })
// export const db = firebase.firestore()

Vue.prototype.$apiSettings = apiSettings

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false
new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
