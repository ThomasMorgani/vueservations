import Vue from 'vue';
import Vuex from 'vuex';
import apiFunctions from '@/modules/api';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    catalogItems: [],
    catalogitemEditting: null, //category id ? set id,
    catalogitemFieldsEditting: [], //category id ? set id,
    catalogView: 'overview',
    categories: [],
    categoryEditting: null, //category id ? set id,
    events: [],
    eventsFilterSearchbox: null,
    eventsFilterCategories: [],
    eventsFilterCategorySelect: [],
    eventsFilterDateRange: [],
    modalCatalogitemEdit: false,
    modalCatalogitemEditCustomFields: false,
    modalCategoryEdit: false
  },
  getters: {
    categoriesDisplayed(state) {
      //actual category ids mapped from select array
      let catsDisplayed = [];
      if (state.eventsFilterCategorySelect.length > 0) {
        state.eventsFilterCategorySelect.forEach(cat =>
          catsDisplayed.push(state.categories[cat].id)
        );
      }
      return catsDisplayed;
    },
    catalogItemsDisplayed(state, getters) {
      let catalogItems = state.catalogItems;
      //filter out selected categories, if any
      if (getters.categoriesDisplayed.length > 0) {
        catalogItems = catalogItems.filter(catalogItem => {
          return getters.categoriesDisplayed.includes(catalogItem.category);
        });
      }
      return catalogItems;
    },
    eventsDisplayed(state, getters) {
      // console.log(getters.categoriesDisplayed);
      let events = state.events;
      if (getters.categoriesDisplayed.length > 0) {
        events = events.filter(event => {
          return getters.categoriesDisplayed.includes(event.itemCategory);
        });
      }
      return events;
    }
  },
  mutations: {
    catalogitemEditting(state, data) {
      state.catalogitemEditting = data;
    },
    catalogView(state, data) {
      state.catalogView = data;
    },
    categoryAdd(state, data) {
      state.categories.push(data);
    },
    categoryDelete(state, data) {
      Vue.delete(state.categories, data);
    },
    categoryEditting(state, data) {
      state.categoryEditting = data;
    },
    categoryUpdate(state, data) {
      //data expects: {key: state.category key, value: state.category value}
      Vue.set(state.categories, data.key, data.value);
    },
    customfieldsSetEditting(state, data) {
      //data expects: {key: state.category key, value: state.category value}
      state.catalogitemFieldsEditting = data;
    },
    eventsFilterCategorySelect(state, val) {
      state.eventsFilterCategorySelect = val;
    },
    eventsFilterSearchbox(state, val) {
      state.eventsFilterSearchbox = val;
    },
    eventsFilterDateRange(state, val) {
      state.eventsFilterDateRange = val;
    },
    setStateValue(state, data) {
      //data expects: {key: state key, value: state value}
      state[data.key] = data.value;
    },
    toggleModalCatalogitemEdit(state, data) {
      state.modalCatalogitemEdit = data;
    },
    toggleModalCatalogitemEditCustomFields(state, data) {
      state.modalCatalogitemEditCustomFields = data;
    },
    toggleModalEditCategory(state, data) {
      state.modalCategoryEdit = data;
    }
  },
  actions: {
    initializeApp({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        dispatch('callApi', {
          endpoint: `/initialize_page_data`
        })
          .then(data => {
            console.log(data);
            if (data) {
              Object.keys(data).forEach(key => {
                commit('setStateValue', { key: key, value: data[key] });
              });
            }
          })
          .catch(err => {
            console.log(err);
            reject();
          })
          .then(() => {
            resolve();
          });
      });
    },
    callApi(context, data) {
      return new Promise((resolve, reject) => {
        apiFunctions.callApi(data.endpoint, data.postData || null).then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    catalogitemEditting({ commit }, data) {
      commit('catalogitemEditting', data);
    },
    catalogitemEdittingCustomfieldsSetEditting({ commit }, data) {
      commit('customfieldsSetEditting', data);
    },
    categoryDelete({ commit, dispatch, state }, data) {
      console.log(data);
      return new Promise((resolve, reject) => {
        dispatch('callApi', {
          endpoint: '/category_delete/' + data.id
        })
          .then(res => {
            console.log(res);
            if (res.status === 'success') {
              commit(
                'categoryDelete',
                state.categories.findIndex(el => el.id === data.id)
              );
            }
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    categoryEdit({ commit }, data) {
      commit('categoryEditting', data);
    },
    categoryEditSave({ commit, dispatch, state }, data) {
      console.log('data', data);
      return new Promise((resolve, reject) => {
        dispatch('callApi', {
          endpoint: '/category_edit',
          postData: data
        })
          .then(res => {
            console.log('res', res);
            if (res.status === 'success') {
              if (data.isNew) {
                data.id = res.data;
                commit('categoryAdd', data);
              } else {
                const catKey = state.categories.findIndex(
                  el => el.id === data.id
                );
                commit('categoryUpdate', { key: catKey, value: data });
              }
            }
            console.log(res);
            resolve(res);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    toggleModalCatalogitemEdit({ commit, state }) {
      commit('toggleModalCatalogitemEdit', !state.modalCatalogitemEdit);
    },
    toggleModalCatalogitemEditCustomFields({ commit, state }) {
      commit(
        'toggleModalCatalogitemEditCustomFields',
        !state.modalCatalogitemEditCustomFields
      );
    },
    toggleModalEditCategory({ commit, state }) {
      commit('toggleModalEditCategory', !state.modalCategoryEdit);
    }
  },
  modules: {}
});
