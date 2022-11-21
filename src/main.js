import Vue from 'vue'
import App from './App.vue'
import store from './store' //vuex
import vuetify from './plugins/vuetify'
import { Table, TableColumn } from 'element-ui'

//REMOVE THESE?
import BtnWithTooltip from '@/components/global/buttons/btnWithTooltip.vue'
import ModalTitle from '@/components/global/modalTitle.vue'

import router from './router'

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
