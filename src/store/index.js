import Vue from 'vue'
import Vuex from 'vuex'
import apiFunctions from '@/modules/api'
import filters from '@/modules/filters'

import defaultData from '@/data/allData'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appSettings: [],
    catalogItems: [],
    catalogItemEditing: null, //category id ? set id,
    ciFieldsEditing: [], //category id ? set id,
    catalogView: 'overview',
    categories: [],
    categoryEditing: null, //category id ? set id,
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
      // image_data: {
      //   id: '2',
      //   file_name: '458d8cab268259a7e676eadc42ec2c6d.gif',
      //   file_name_orig: 'eil2.gif',
      //   file_ext: '.gif',
      //   file_type: 'image/gif',
      //   file_size: '94.93',
      //   file_path: '/reservations/images/uploads/',
      //   height: '768',
      //   width: '844',
      //   date_added: '2020-01-14 12:03:35',
      //   src:''
      // },
      description: null,
      name: null,
      reservation_buffer: null,
      reservation_length: null,
      status: null
    },
    defaultModalProps: {
      'max-width': '800',
      persistent: true,
      transition: 'dialog-transition',
      width: 'unset'
    },
    events: [],
    eventEditing: null,
    filterAvailability: [],
    filterCategory: [],
    filterRangeDate: [],
    filterSearch: '',
    filterStatus: [],
    filterVisibility: '',
    images: [],
    imagePreviewData: {},
    modalCatalogCustomfield: false,
    modalImageFullPreview: false,
    modalCatalogItemEdit: false,
    modalEditCatalogItemFields: false,
    modalCategoryEdit: false,
    patronEditing: null,
    patrons: [],
    filterDrawer: false,
    snackbarData: {},
    snackbarSettings: {
      defaultColor: 'primary',
      'multi-line': true,
      center: true,
      timeout: 5000,
      top: true,
      statusText: null,
      vertical: true
    },
    snackbarState: false,
    sort: {
      direction: 1, //1 asc, =1 desc
      value: 'event' //value to be sorted
    },
    sortOptions: {
      ci: {
        icon: 'mdi-layers',
        text: 'Catalog Item',
        value: 'ci'
      },
      event: {
        icon: 'mdi-calendar-clock',
        text: 'Event',
        value: 'event'
      },
      patron: {
        icon: 'mdi-account',
        text: 'Patron',
        value: 'patron'
      }
    },
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
    }
  },
  getters: {
    appSettingsByName(state) {
      const settings = {}
      Object.values(state.appSettings).forEach(setting => {
        settings[setting.name] = setting
      })
      return settings
    },
    categoriesById(state) {
      let cats = {}
      if (Array.isArray(state.categories)) {
        state.categories.forEach(c => (cats[c.id] = c))
      }
      return cats
    },
    defaultCiImage(state, getters) {
      const defaultImageId = getters.appSettingsByName.Default_Image.setting
      const defaultImage = state.images.filter(
        image => image.id == defaultImageId
      )[0]
      return defaultImage
      //$apiSettings set in .env.js
      const baseUrl = Vue?.prototype?.$apiSettings?.baseUrl || ''
      return defaultImage?.srcType === 'url'
        ? defaultImage.src
        : baseUrl + defaultImage.src
    },
    filtersApplied(state) {
      //TODO: will need different names array dependant on view
      let filters = []
      const names = [
        'filterAvailability',
        'filterCategory',
        'filterRangeDate',
        'filterSearch',
        'filterStatus',
        'filterVisibility'
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
        height = height - 220
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  },

  actions: {
    apiCall({ dispatch }, data) {
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

    initializeApp({ commit }) {
      return new Promise(resolve => {
        Object.keys(defaultData).forEach(key => {
          const localData = localStorage.getItem(key)
          const data =
            localData && localData !== 'null' && localData !== 'undefined'
              ? JSON.parse(localData)
              : defaultData[key]
          commit('setStateValue', { key: key, value: data })
        })
        return resolve()
      })
    },
    appDataDelete({ dispatch, commit, state }, datasetsDeleting) {
      return new Promise(resolve => {
        //defaultData
        //affected Data to be saved
        const defaultDataByName = {}
        Object.values(defaultData.appSettings).forEach(setting => {
          defaultDataByName[setting.name] = setting
        })
        //order datasetDeleting by effeciency
        for (let dataSet of datasetsDeleting) {
          commit('setStateValue', { key: dataSet, value: [] })
          switch (dataSet) {
            case 'catalogItems':
              commit('setStateValue', { key: 'events', value: [] })
              break
            case 'categories': {
              const defaultCategory = defaultData.categories.find(
                c => c.id == defaultDataByName.Default_Category.setting
              )
              defaultCategory.setting =
                defaultDataByName.Default_Category.setting
              const catalogItems = state.catalogItems.map(ci => {
                return { ...ci, category: defaultCategory.id }
              })
              dispatch('appSettingUpdate', {
                settingName: 'Default_Category',
                settingValue: defaultCategory.setting
              })
              commit('setStateValue', {
                key: 'categories',
                value: [defaultCategory]
              })
              commit('setStateValue', {
                key: 'catalogItems',
                value: catalogItems
              })
              break
            }
            case 'customFields': {
              const catalogItems = state.catalogItems.map(ci => {
                return { ...ci, customFields: [] }
              })
              commit('setStateValue', {
                key: 'catalogItems',
                value: catalogItems
              })
              commit('setStateValue', {
                key: 'customFields',
                value: []
              })

              break
            }
            case 'events': {
              commit('setStateValue', {
                key: 'events',
                value: []
              })
              const catalogItems = state.catalogItems.map(ci => {
                return { ...ci, lastReservation: null }
              })
              commit('setStateValue', {
                key: 'catalogItems',
                value: catalogItems
              })
              break
            }
            case 'images': {
              const defaultImage = defaultData.images.find(
                i => i.id === defaultDataByName.Default_Image.setting
              )
              const catalogItems = state.catalogItems.map(ci => {
                return {
                  ...ci,
                  image: defaultImage.id,
                  image_data: defaultImage
                }
              })

              commit('setStateValue', {
                key: 'images',
                value: [defaultImage]
              })
              commit('setStateValue', {
                key: 'catalogItems',
                value: catalogItems
              })
              break
            }
            case 'patrons': {
              commit('setStateValue', {
                key: 'patrons',
                value: []
              })

              commit('setStateValue', {
                key: 'events',
                value: []
              })

              const catalogItems = state.catalogItems.map(ci => {
                return { ...ci, lastReservation: null }
              })
              commit('setStateValue', {
                key: 'catalogItems',
                value: catalogItems
              })

              break
            }
            case 'xxxxx': {
              break
            }

            default:
              commit('setStateValue', { key: dataSet, value: [] })
          }

          for (let dataSet in defaultData) {
            dispatch('localStorageWrite', {
              key: dataSet,
              data: state[dataSet] || null
            })
          }

          resolve(true)
        }
      })
    },
    appSettingUpdate(
      { dispatch, getters, state },
      { settingName, settingValue }
    ) {
      const setting = {
        ...getters.appSettingsByName[settingName],
        setting: settingValue
      }
      const settings = [
        ...state.appSettings.filter(s => s.name !== settingName),
        setting
      ]
      dispatch('setStateValue', {
        key: 'appSettings',
        value: [...settings]
      })
    },
    catalogItemAdd({ commit }, data) {
      commit('catalogItemAdd', data)
    },
    catalogItemDelete({ commit, state }, data) {
      return new Promise(resolve => {
        commit(
          'catalogItemDelete',
          state.catalogItems.findIndex(el => el.id === data.id)
        )
        return resolve(true)
      })
    },
    catalogItemNew({ getters, state }, {$vuetify, overrides = {}}) {
      const newItem = { ...state.defaultCatalogItem }
      const {
        Default_reservation_length,
        Default_reservation_buffer
      } = state.appSettings.reduce((acc, setting) => {
        if (
          setting.name === 'Default_reservation_buffer' ||
          setting.name === 'Default_reservation_length'
        ) {
          acc[setting.name] = setting
        }
        return acc
      }, {})
      newItem.reservation_buffer = Default_reservation_buffer.setting
      newItem.reservation_length = Default_reservation_length.setting
      const theme = $vuetify.theme.isDark ? 'dark' : 'light'
      newItem.color = $vuetify.theme.themes[theme].primary
      newItem.image_data = { ...getters.defaultCiImage }
      newItem.category =
        getters?.appSettingsByName?.Default_Category.setting || null
      newItem.reservation_buffer =
        getters?.appSettingsByName?.Default_reservation_buffer.setting || null
      newItem.reservation_length =
        getters?.appSettingsByName?.Default_reservation_length.setting || null
      newItem.status = 'enabled'

      this.dispatch('setStateValue', {
        key: 'catalogItemEditing',
        value: { ...newItem, ...overrides }
      })
    },
    //PICK UP HERE, NOT POPULATING NEW CI ITEM FROM EVENT DIALOG
    catalogItemSetValue({ commit, state }, data) {
      //data : {id: id of cat item, item: key of value updating, data: value of item}
      const ciIndex = state.catalogItems.findIndex(el => el.id === data.id)
      if (ciIndex > -1) {
        commit('catalogItemSetValue', { ...data, index: ciIndex })
      } else {
        return false
      }
    },
    catalogItemEditingSetValue({ commit }, data) {
      //data:{key: item editing int, data: fields obj}
      commit('catalogItemEditingSetValue', data)
    },
    ciEditingcfEditingSet({ commit }, data) {
      return new Promise(resolve => {
        commit('COMMIT_CUSTOM_FIELDS_Editing', data)
        resolve()
      })
    },
    categoryDelete({ commit, dispatch, state }, data) {
      return new Promise((resolve, reject) => {
        const result = { status: 'success', message: 'Category removed' }
        const idx = state.categories.findIndex(el => el.id === data.id)
        if (idx < 0) {
          result.status = 'error'
          result.message = 'Category not found'
          commit('setStateValue', {
            key: 'snackbarData',
            value: result
          })
          commit('setStateValue', { key: 'snackbarState', value: true })
          return reject(result)
        }

        commit('categoryDelete', idx)
        //Update any CI with deleted category with default category
        const defaultCat = filters.getObjectFromArray(
          state.appSettings,
          'name',
          'Default_Category',
          'setting'
        )
        state.catalogItems.forEach((ci, i) => {
          if (ci.category === data.id) {
            commit('catalogItemSetValue', {
              index: i,
              key: 'category',
              data: defaultCat
            })
          }
        })
        commit('setStateValue', {
          key: 'snackbarData',
          value: result
        })
        commit('setStateValue', { key: 'snackbarState', value: true })
        //SAVE CATEGORIES
        dispatch('localStorageWrite', {
          key: 'categories',
          data: state.categories
        })
        return resolve(result)
      })
    },
    categoryEditSave({ commit, dispatch, state }, data) {
      return new Promise((resolve, reject) => {
        const result = {
          status: 'success',
          message: `Category ${data?.isNew ? 'Added' : 'Updated'}`,
          data: null
        }
        if (data.isNew) {
          data.id = new Date().getTime()
          commit('categoryAdd', data)
        } else {
          const catKey = state.categories.findIndex(el => el.id === data.id)
          if (catKey < 0) {
            result.status = 'error'
            result.message = 'Category Not Found'
            return reject(result)
          }
          commit('categoryUpdate', { key: catKey, value: data })
        }
        dispatch('localStorageWrite', {
          key: 'categories',
          data: state.categories
        })
        result.data = data.id
        resolve(result)
      })
    },
    customfieldsAddField({ commit }, data) {
      commit('customfieldsAddField', data)
    },
    deleteStateValueByKey({ commit }, data) {
      commit('deleteStateValueByKey', data)
    },
    eventAdd({ commit, dispatch, state }, event) {
      commit('COMMIT_EVENTS', [...state.events, event])
      dispatch('localStorageWrite', {
        key: 'events',
        data: state.events
      })
      return true
    },
    eventDelete({ commit, dispatch, state }, id) {
      const events = state.events.filter(event => event.id != id)
      commit('COMMIT_EVENTS', events)
      dispatch('localStorageWrite', {
        key: 'events',
        data: events
      })
      return true
    },
    eventUpdate() {
      //TODO: delete.. handled in ciEdit
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
    localStorageWrite(context, { key, data, isReference = true }) {
      data = isReference ? JSON.stringify(data) : data
      return localStorage.setItem(key, data)
    },
    resetDemo() {
      localStorage.clear()
      window.location.replace('/')
    },
    settingsNew({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        dispatch('apiCall', {
          endpoint: '/rm',
          postData: data
        })
          .then(res => {
            if (res.status === 'success') {
              commit('pushStateValue', { key: 'settings', value: data })
            }
            resolve(res)
          })
          .catch(err => {
            console.log(err)
            reject(err)
          })
      })
    },

    setStateValue({ commit }, data) {
      if (data.isPush) {
        //console.log('is push')
        commit('pushStateValue', { key: data.key, value: data.value })
      } else {
        commit('setStateValue', { key: data.key, value: data.value })
      }
    },
    setStateValueByKey({ commit }, data) {
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
    togglemodalCatalogCustomfield({ commit, state }, data = null) {
      if (data !== null) {
        commit('setStateValue', { key: 'customFieldEditing', value: data })
      }
      commit('togglemodalCatalogCustomfield', !state.modalCatalogCustomfield)
    },
    toggleModalCatalogItemEdit({ commit, state }) {
      commit('toggleModalCatalogItemEdit', !state.modalCatalogItemEdit)
    },
    togglemodalEditCatalogItemFields({ commit, state }) {
      commit(
        'togglemodalEditCatalogItemFields',
        !state.modalEditCatalogItemFields
      )
    },
    toggleModalEditCategory({ commit, state }) {
      commit('toggleModalEditCategory', !state.modalCategoryEdit)
    },
    toggleModalImageFullPreview({ commit, state }) {
      commit('toggleModalImageFullPreview', !state.modalImageFullPreview)
    },
    toggleSnackbar({ commit, state }, data) {
      commit('COMMIT_SNACKBAR_DATA', data)
      commit('COMMIT_SNACKBAR_STATE', !state.snackbarState)
    }
  },
  mutations: {
    COMMIT_CUSTOM_FIELDS_Editing(state, data) {
      //data expects: {key: state.category key, value: state.category value}
      state.ciFieldsEditing = data
    },
    COMMIT_EVENTS(state, events) {
      state.events = [...events]
    },
    COMMIT_SNACKBAR_DATA(state, data) {
      state.snackbarData = { ...data }
    },
    COMMIT_SNACKBAR_STATE(state, value) {
      state.snackbarState = value
    },

    //
    //
    //  NEW ABOVE, TODO: REFACTOR BELOW
    //
    //
    catalogItemAdd(state, newCi) {
      state.catalogItems = [...state.catalogItems, newCi]
    },
    catalogItemDelete(state, data) {
      Vue.delete(state.catalogItems, data)
    },
    catalogItemEditingSetValue(state, data) {
      //data : {key: value editing, data: value of item }
      state.catalogItemEditing[data.key] = data.data
    },
    catalogItemSetValue(state, data) {
      //data : {key: value editing, data: value of item }
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
    togglemodalCatalogCustomfield(state, data) {
      state.modalCatalogCustomfield = data
    },
    toggleModalCatalogItemEdit(state, data) {
      state.modalCatalogItemEdit = data
    },
    togglemodalEditCatalogItemFields(state, data) {
      state.modalEditCatalogItemFields = data
    },
    toggleModalEditCategory(state, data) {
      state.modalCategoryEdit = data
    },
    toggleModalImageFullPreview(state, data) {
      state.modalImageFullPreview = data
    }
  },
  modules: {}
})
