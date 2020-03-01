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
      v-model="statusSelect"
      :items="orderBy(statusOptions, 'text')"
      item-text="text"
      item-value="text"
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
              statusSelect.includes(item.text)
                ? 'mdi-checkbox-marked'
                : 'mdi-checkbox-blank-outline'
            "
          ></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon :color="item.color" v-text="item.icon"></v-icon>
        </v-list-item-action>
      </template>
      <template v-slot:selection="{ item }">
        <v-chip
          :color="item.color"
          close
          @click:close="
            statusSelect = statusSelect.filter(i => i !== item.text)
          "
          class="white--text font-weight-bold"
        >
          <span>{{ item.text }}</span>
        </v-chip>
      </template>
    </v-select>
    <!-- AVAILABILITY SELECT -->

    <v-select
      v-model="availabilitySelect"
      :items="orderBy(availabilityOptions, 'text')"
      item-text="text"
      item-value="text"
      label="Availability"
      no-hint
      no-title
      clearable
      color="primary"
      class="flex-grow-0 flex-shrink-1"
    >
      <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.text"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon :color="item.color" v-text="item.icon"></v-icon>
        </v-list-item-action>
      </template>
      <template v-slot:selection="{ item }">
        <!-- <v-chip :color="item.color" class="white--text font-weight-bold">
          <span>{{ item.text }}</span>
        </v-chip>-->
        <v-list-item>
          <v-list-item-icon>
            <v-icon :color="item.color" v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
      filterStatus: state => state.filterStatus,
      statusData: state => state.statusData,
      viewMain: state => state.viewMain
    }),
    ...mapGetters(['categoriesById']),
    availabilityOptions() {
      const names = ['available', 'unavailable']
      let statuses = []
      names.forEach(n => statuses.push(this.statusData[n]))
      return statuses
    },
    availabilitySelect: {
      get() {
        return this.filterAvailability
      },
      set(val) {
        console.log(val)
        this.$store.dispatch('setStateValue', {
          key: 'filterAvailability',
          value: typeof val == 'string' ? val.toLowerCase() : val
        })
        // this.$store.commit('eventsFilterCategorySelect', val)
      }
    },
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
    },
    statusOptions() {
      const names = ['blocked', 'disabled', 'enabled']
      let statuses = []
      names.forEach(n => statuses.push(this.statusData[n]))
      return statuses
    },
    statusSelect: {
      get() {
        return this.filterStatus
      },
      set(val) {
        this.$store.dispatch('setStateValue', {
          key: 'filterStatus',
          value: val
        })
        // this.$store.commit('eventsFilterCategorySelect', val)
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
