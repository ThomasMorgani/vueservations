<template>
  <v-card class="d-flex flex-column pa-5 justify-start" height="100%">
    <v-text-field
      solo
      rounded
      single-line
      clearable
      formatsend-inner-icon="mdi-magnify"
      placeholder="Search"
      color="primary"
      class="flex-grow-0 flex-shrink-1"
      v-model="searchField"
    ></v-text-field>
    <v-divider color="primary--text"></v-divider>
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
          <v-icon :color="item.color" v-text="'mdi-checkbox-blank-circle'"></v-icon>
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
    <v-select
      v-model="categorySelect"
      :items="orderBy(categories, 'name')"
      item-text="name"
      item-value="id"
      label="Status"
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
          <v-icon :color="item.color" v-text="'mdi-checkbox-blank-circle'"></v-icon>
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
  methods: {
    test(e) {
      console.log(e)
      return 'primary'
    }
  }
}
</script>

<style></style>
