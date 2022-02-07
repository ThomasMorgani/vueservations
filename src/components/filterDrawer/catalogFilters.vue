<template>
  <v-card class="d-flex flex-column pa-5 justify-start" height="100%">
    <!-- span tag to work around v-card class first child inherit border-radius -->
    <span></span>
    <v-text-field
      solo
      rounded
      clearable
      prepend-inner-icon="mdi-magnify"
      placeholder="Search"
      color="primary"
      class="flex-grow-0 flex-shrink-1"
      v-model="searchField"
    ></v-text-field>
    <v-divider color="primary--text"></v-divider>
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
    <!--CATEGORY SELECT -->
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
      <!--CATEGORY SELECT ITEM -->
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
    <!--STATUS SELECT -->
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

    <!-- VISIBILITY SELECT -->
    <v-select
      v-model="visibilitySelect"
      :items="visibilityOptions"
      label="Visibility"
      no-hint
      no-title
      clearable
      color="primary"
      class="flex-grow-0 flex-shrink-1"
    >
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
      filterVisibility: state => state.filterVisibility,
      statusData: state => state.statusData
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
        this.$store.dispatch('setStateValue', {
          key: 'filterAvailability',
          value: typeof val == 'string' ? val.toLowerCase() : val
        })
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
      }
    },
    visibilityOptions() {
      const options = [
        {
          text: 'Internal',
          value: '1'
        },
        {
          text: 'Public',
          value: '0'
        }
      ]
      return options
    },
    visibilitySelect: {
      get() {
        return this.filterVisibility
      },
      set(val) {
        this.$store.dispatch('setStateValue', {
          key: 'filterVisibility',
          value: val
        })
      }
    }
  },
  methods: {}
}
</script>

<style></style>
