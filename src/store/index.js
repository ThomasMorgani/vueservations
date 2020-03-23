import Vue from 'vue'
import Vuex from 'vuex'
import apiFunctions from '@/modules/api'
import filters from '@/modules/filters'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    catalogItems: [],
    catalogitemediting: null, //category id ? set id,
    catalogitemFieldsediting: [], //category id ? set id,
    catalogView: 'overview',
    categories: [],
    categoryediting: null, //category id ? set id,
    content: {
      main: {
        height: 0,
        width: 0
      },
      test: 2
    },
    customFields: [],
    customFieldEditing: null,
    defaultCatalogItem: {
      abbreviation: null,
      categoryName: null,
      customFields: [],
      id: null,
      image_data: {
        id: '2',
        file_name: '458d8cab268259a7e676eadc42ec2c6d.gif',
        file_name_orig: 'eil2.gif',
        file_ext: '.gif',
        file_type: 'image/gif',
        file_size: '94.93',
        file_path: '/reservations/images/uploads/',
        height: '768',
        width: '844',
        date_added: '2020-01-14 12:03:35',
        src:
          'https://www.eipl.org/reservations/images/uploads/458d8cab268259a7e676eadc42ec2c6d.gif'
      },
      description: null,
      name: null,
      status: null
    },
    events: [],
    eventediting: null,
    filterAvailability: [],
    filterCategory: [],
    filterRangeDate: [],
    filterSearch: '',
    filterStatus: [],
    imagePreviewData: {},
    modalCatalogCustomfield: false,
    modalImageFullPreview: false,
    modalCatalogitemEdit: false,
    modalCatalogitemEditCustomfields: false,
    modalCategoryEdit: false,
    patronEditing: null,
    patrons: [],
    settings: [],
    sideDrawer: false,
    snackbarData: {},
    snackbarSettings: {
      defaultColor: 'primary',
      'multi-line': true,
      bottom: true,
      right: true,
      timeout: 5000,
      vertical: true
    },
    snackbarState: false,
    statusData: {
      available: {
        color: 'success',
        icon: 'mdi-calendar-check',
        popovertext: 'Item is available for reservation',
        text: 'AVAILABLE',
        value: 'available'
      },
      blocked: {
        color: 'error',
        icon: 'mdi-phone-cancel',
        popovertext: "Item's service blocked",
        text: 'BLOCKED',
        value: 'blocked'
      },
      enabled: {
        color: 'success',
        icon: 'mdi-check-circle',
        popovertext: 'Item is enabled',
        text: 'ENABLED',
        value: 'enabled'
      },
      disabled: {
        color: 'error',
        icon: 'mdi-cancel',
        popovertext: 'Item is disabled',
        text: 'DISABLED',
        value: 'disabled'
      },
      unavailable: {
        color: 'warning',
        icon: 'mdi-calendar-alert',
        popovertext: 'Item is currently reserved',
        text: 'RESERVED',
        value: 'unavailable'
      },
      unkown: {
        color: 'disabled',
        icon: 'mdi-help-circle',
        popovertext: 'Item status unknown',
        text: 'STATUS UNKNOWN',
        value: 'unkown'
      }
    },
    viewMain: null,
    viewSub: null
  },
  getters: {
    categoriesById(state) {
      let cats = {}
      if (Array.isArray(state.categories)) {
        state.categories.forEach(c => (cats[c.id] = c))
      }
      return cats
    },
    filtersApplied(state) {
      //TODO: will need different names array dependant on view
      let filters = []
      const names = [
        'filterAvailability',
        'filterCategory',
        'filterRangeDate',
        'filterSearch',
        'filterStatus'
      ]
      names.forEach(n =>
        state[n] && state[n].length > 0
          ? filters.push({ name: n, value: state[n] })
          : null
      )
      return filters
    },
    styleContentHeight(state) {
      let height = state.content.main.y || null
      if (height) {
        height = height - 200
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  },
  mutations: {
    catalogitemAdd(state, data) {
      state.catalogItems.push(data)
    },
    catalogitemDelete(state, data) {
      Vue.delete(state.catalogItems, data)
    },
    catalogitemeditingSetValue(state, data) {
      //data : {key: value editing, data: value of item }
      state.catalogitemediting[data.key] = data.data
    },
    catalogitemSetValue(state, data) {
      //data : {key: value editing, data: value of item }
      //console.log(data)
      state.catalogItems[data.index][data.key] = data.data
    },
    catalogView(state, data) {
      state.catalogView = data
    },
    categoryAdd(state, data) {
      state.categories.push(data)
    },
    categoryDelete(state, data) {
      Vue.delete(state.categories, data)
    },
    categoryUpdate(state, data) {
      //data expects: {key: state.category key, value: state.category value}
      Vue.set(state.categories, data.key, data.value)
    },
    customfieldsSetediting(state, data) {
      //data expects: {key: state.category key, value: state.category value}
      state.catalogitemFieldsediting = data
    },
    customfieldsAddField(state, field) {
      state.customFields.push(field)
    },
    deleteStateValueByKey(state, data) {
      //data expects: {key: state key, value: state value}
      // state[data.stateItem][data.key] = data.value
      Vue.delete(state[data.stateItem], data.key)
    },
    eventsFilterCategorySelect(state, val) {
      state.eventsFilterCategorySelect = val
    },
    eventsFilterSearchbox(state, val) {
      state.eventsFilterSearchbox = val
    },
    eventsFilterDateRange(state, val) {
      state.eventsFilterDateRange = val
    },
    pushStateValue(state, data) {
      //data expects: {key: state key, value: state value}
      state[data.key].push(data.value)
    },
    pushStateValueByKey(state, data) {
      //data expects: {key: state key, value: state value}
      state[data.stateItem][data.key].push(data.value)
    },
    setStateValue(state, data) {
      //data expects: {key: state key, value: state value}
      state[data.key] = data.value
    },
    setStateValueByKey(state, data) {
      //data expects: {key: state key, value: state value}
      // state[data.stateItem][data.key] = data.value
      Vue.set(state[data.stateItem], data.key, data.value)
    },
    toggleModalCatalogCustomfield(state, data) {
      state.modalCatalogCustomfield = data
    },
    toggleModalCatalogitemEdit(state, data) {
      state.modalCatalogitemEdit = data
    },
    toggleModalCatalogitemEditCustomfields(state, data) {
      state.modalCatalogitemEditCustomfields = data
    },
    toggleModalEditCategory(state, data) {
      state.modalCategoryEdit = data
    },
    toggleModalImageFullPreview(state, data) {
      state.modalImageFullPreview = data
    }
  },
  actions: {
    apiCall({ dispatch }, data) {
      // //console.log(data)
      return new Promise((resolve, reject) => {
        apiFunctions.callApi(data.endpoint, data.postData || null).then(
          resp => {
            if (resp.status && resp.message) {
              dispatch('setStateValue', {
                key: 'snackbarData',
                value: { status: resp.status, message: resp.message }
              })
              dispatch('setStateValue', {
                key: 'snackbarState',
                value: true
              })
            }
            resolve(resp)
          },
          error => {
            reject(error)
          }
        )
      })
    },
    apiPost({ dispatch }, data) {
      console.log(data)
      return new Promise((resolve, reject) => {
        apiFunctions.postApi(data.endpoint, data.postData).then(
          resp => {
            if (resp.status && resp.message) {
              dispatch('setStateValue', {
                key: 'snackbarData',
                value: { status: resp.status, message: resp.message }
              })
              dispatch('setStateValue', {
                key: 'snackbarState',
                value: true
              })
            }
            resolve(resp)
          },
          error => {
            reject(error)
          }
        )
      })
    },
    initializeApp({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        dispatch('apiCall', {
          endpoint: `/initialize_page_data`
        })
          .then(data => {
            // //console.log(data)
            if (data) {
              Object.keys(data).forEach(key => {
                commit('setStateValue', { key: key, value: data[key] })
              })
            }
          })
          .catch(err => {
            console.log(err)
            reject()
          })
          .then(() => {
            resolve()
          })
      })
    },
    catalogitemAdd({ commit }, data) {
      commit('catalogitemAdd', data)
    },
    catalogitemDelete({ commit, dispatch, state }, data) {
      return new Promise((resolve, reject) => {
        dispatch('apiCall', {
          endpoint: '/catalogItem_delete/' + data.id
        })
          .then(res => {
            //console.log(res)
            if (res.status === 'success') {
              commit(
                'catalogitemDelete',
                state.catalogItems.findIndex(el => el.id === data.id)
              )
            }
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    catalogitemSetValue({ commit, state }, data) {
      //data : {id: id of cat item, item: key of value updating, data: value of item}
      const ciIndex = state.catalogItems.findIndex(el => el.id === data.id)
      //console.log(ciIndex)
      if (ciIndex > -1) {
        commit('catalogitemSetValue', { ...data, index: ciIndex })
      } else {
        return false
      }
    },
    catalogitemeditingSetValue({ commit }, data) {
      //data : item editing int, fields obj
      commit('catalogitemeditingSetValue', data)
    },
    catalogitemeditingcustomfieldsSetediting({ commit }, data) {
      return new Promise(resolve => {
        commit('customfieldsSetediting', data)
        resolve()
      })
    },
    categoryDelete({ commit, dispatch, state }, data) {
      return new Promise((resolve, reject) => {
        dispatch('apiCall', {
          endpoint: '/category_delete/' + data.id
        })
          .then(res => {
            //console.log(res)
            if (res.status === 'success') {
              commit(
                'categoryDelete',
                state.categories.findIndex(el => el.id === data.id)
              )
              //Update any CI with deleted category with default category
              const defaultCat = filters.getObjectFromArray(
                state.settings,
                'name',
                'Default_Category',
                'setting'
              )
              state.catalogItems.forEach((ci, i) => {
                if (ci.category === data.id) {
                  commit('catalogitemSetValue', {
                    index: i,
                    key: 'category',
                    data: defaultCat
                  })
                }
              })
            }
            commit('setStateValue', { key: 'snackbarData', value: res })
            commit('setStateValue', { key: 'snackbarState', value: true })
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    categoryEditSave({ commit, dispatch, state }, data) {
      // //console.log('data', data)
      return new Promise((resolve, reject) => {
        dispatch('apiCall', {
          endpoint: '/category_edit',
          postData: data
        })
          .then(res => {
            //console.log('res', res)
            if (res.status === 'success') {
              if (data.isNew) {
                data.id = res.data
                commit('categoryAdd', data)
              } else {
                const catKey = state.categories.findIndex(
                  el => el.id === data.id
                )
                commit('categoryUpdate', { key: catKey, value: data })
              }
            }
            //console.log(res)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    customfieldsAddField({ commit }, data) {
      commit('customfieldsAddField', data)
    },
    deleteStateValueByKey({ commit }, data) {
      commit('deleteStateValueByKey', data)
    },
    filtersClearAll({ commit }) {
      const filterDefaults = {
        filterAvailability: '',
        filterCategory: [],
        filterRangeDate: [],
        filterSearch: '',
        filterStatus: []
      }
      Object.keys(filterDefaults).forEach(f => {
        commit('setStateValue', { key: f, value: filterDefaults[f] })
      })
    },
    reservationAdd() {},
    settingsNew({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        dispatch('apiCall', {
          endpoint: '/settings_new',
          postData: data
        })
          .then(res => {
            //console.log('res', res)
            if (res.status === 'success') {
              commit('pushStateValue', { key: 'settings', value: data })
            }
            //console.log(res)
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },
    setStateValue({ commit }, data) {
      //console.log(data)
      if (data.isPush) {
        //console.log('is push')
        commit('pushStateValue', { key: data.key, value: data.value })
      } else {
        commit('setStateValue', { key: data.key, value: data.value })
      }
    },
    setStateValueByKey({ commit }, data) {
      //console.log(data)
      if (data.isPush) {
        commit('pushStateValueByKey', {
          stateItem: data.stateItem,
          key: data.key,
          value: data.value
        })
      } else {
        commit('setStateValueByKey', {
          stateItem: data.stateItem,
          key: data.key,
          value: data.value
        })
      }
    },
    toggleStateValue({ commit, state }, data) {
      commit('setStateValue', { key: data, value: !state[data] })
    },
    toggleModalCatalogCustomfield({ commit, state }) {
      commit('toggleModalCatalogCustomfield', !state.modalCatalogCustomfield)
    },
    toggleModalCatalogitemEdit({ commit, state }) {
      commit('toggleModalCatalogitemEdit', !state.modalCatalogitemEdit)
    },
    toggleModalCatalogitemEditCustomfields({ commit, state }) {
      commit(
        'toggleModalCatalogitemEditCustomfields',
        !state.modalCatalogitemEditCustomfields
      )
    },
    toggleModalEditCategory({ commit, state }) {
      commit('toggleModalEditCategory', !state.modalCategoryEdit)
    },
    toggleModalImageFullPreview({ commit, state }) {
      commit('toggleModalImageFullPreview', !state.modalImageFullPreview)
    }
  },
  modules: {}
})
