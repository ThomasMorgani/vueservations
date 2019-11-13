import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    eventsFilterSearchbox: null,
    eventsFilterCategories: ["Electronic", "Game", "Hotspot", "Toy"],
    eventsFilterCategorySelect: [],
    eventsFilterDateRange: []
  },
  mutations: {
    eventsFilterCategorySelect(store, val) {
      store.eventsFilterCategorySelect = val;
    },
    eventsFilterSearchbox(store, val) {
      store.eventsFilterSearchbox = val;
    },
    eventsFilterDateRange(store, val) {
      store.eventsFilterDateRange = val;
    }
  },
  actions: {},
  modules: {}
});
