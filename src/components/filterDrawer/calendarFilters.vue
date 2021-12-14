<template>
  <v-card class="d-flex flex-column py-1 px-4 justify-start" height="100%">
    <v-text-field
      single-line
      rounded
      solo
      clearable
      formatsend-inner-icon="mdi-magnify"
      placeholder="Search"
      color="primary"
      class="flex-grow-0 flex-shrink-1"
      v-model="searchField"
    ></v-text-field>
    <v-select
      v-model="categorySelect"
      :items="orderBy(categories, 'name')"
      item-text="name"
      item-value="id"
      label="Category"
      multiple
      chips
      deletable-chips
      no-hint
      no-title
      clearable
      color="primary"
      class="flex-grow-0 flex-shrink-1"
    >
      <template v-slot:item="{ item }">
        <v-list-item-icon>
          <v-icon
            v-text="
              filterCategory.includes(item.id)
                ? 'mdi-checkbox-marked'
                : 'mdi-checkbox-blank-outline'
            "
          ></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon
            :color="item.color"
            v-text="'mdi-checkbox-blank-circle'"
          ></v-icon>
        </v-list-item-action>
      </template>
      <template v-slot:selection="{ item }">
        <v-chip
          :color="item.color"
          close
          @click:close="
            categorySelect = categorySelect.filter(i => i !== item.id)
          "
          class="white--text font-weight-bold"
        >
          <span>{{ item.name }}</span>
        </v-chip>
      </template>
    </v-select>
    <p class="subtitle-2 mb-0 primary--text">DATE RANGE</p>
    <v-date-picker
      v-model="dateRange"
      range
      color="primary"
      class="flex-grow-0 flex-shrink-1 mt-1"
      no-title
    ></v-date-picker>
    <v-text-field
      :value="dateRangeText"
      no-label
      formatsend-icon="mdi-calendar-range"
      readonly
      placeholder="Select range above"
      clearable
      @click:clear="dateRange = []"
    ></v-text-field>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Vue2Filters from 'vue2-filters'

export default {
  mixins: [Vue2Filters.mixin],
  computed: {
    ...mapState({
      categories: state => state.categories,
      filterCategory: state => state.filterCategory,
      filterRangeDate: state => state.filterRangeDate,
      filterSearch: state => state.filterSearch,
      viewMain: state => state.viewMain
    }),
    ...mapGetters(['categoriesById']),
    categorySelect: {
      get() {
        return this.filterCategory
      },
      set(val) {
        this.$store.dispatch('setStateValue', {
          key: 'filterCategory',
          value: val
        })
        // this.$store.commit('eventsFilterCategorySelect', val)
      }
    },
    dateRangeText() {
      return this.dateRange.length === 2 ? this.dateRange.join(' ~ ') : null
    },
    dateRange: {
      get() {
        return this.filterRangeDate
      },
      set(val) {
        this.$store.dispatch('setStateValue', {
          key: 'filterRangeDate',
          value: val
        })
        // this.$store.commit('eventsFilterDateRange', val)
      }
    },
    searchField: {
      get() {
        return this.filterSearch
      },
      set(val) {
        this.$store.dispatch('setStateValue', {
          key: 'filterSearch',
          value: val
        })
        // this.$store.commit('eventsFilterSearchbox', val)
      }
    }
  },
  methods: {}
}
</script>

<style></style>
