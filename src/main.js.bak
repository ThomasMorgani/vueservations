import Vue from 'vue'
import App from './App.vue'
import store from './store' //vuex
import vuetify from './plugins/vuetify'
import { Table, TableColumn } from 'element-ui'

import ModalTitleText from '@/components/global/modalTitleText.vue'

import { apiSettings } from './.env.local.js'

// import firebase from 'firebase/app'
// import 'firebase/firestore'

// firebase.initializeApp({ ...firebaseSettings })
// export const db = firebase.firestore()

Vue.prototype.$apiSettings = apiSettings

Vue.use(Table)
Vue.use(TableColumn)
Vue.component('ModalTitleText', ModalTitleText)

Vue.config.productionTip = false
new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
