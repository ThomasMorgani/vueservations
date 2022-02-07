import Vue from 'vue'
import App from './App.vue'
import store from './store' //vuex
import vuetify from './plugins/vuetify'
import { Table, TableColumn } from 'element-ui'

import BtnWithTooltip from '@/components/global/buttons/btnWithTooltip.vue'
import ModalTitle from '@/components/global/modalTitle.vue'

import { apiSettings } from './.env.local.js'
import router from './router'

// import firebase from 'firebase/app'
// import 'firebase/firestore'

// firebase.initializeApp({ ...firebaseSettings })
// export const db = firebase.firestore()

Vue.prototype.$apiSettings = apiSettings

Vue.use(Table)
Vue.use(TableColumn)
Vue.component('BtnWithTooltip', BtnWithTooltip)
Vue.component('ModalTitle', ModalTitle)

Vue.config.productionTip = false
new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
