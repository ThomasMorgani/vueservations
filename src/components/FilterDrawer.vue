<template>
  <v-navigation-drawer
    app
    clipped
    right
    :value="value"
    @input="$emit('input')"
    width="350"
  >
    <v-card class="d-flex flex-column pa-5 justify-start" height="100%">
      <span class="title align-center primary--text">
        <v-icon left color="primary">mdi-filter</v-icon>FILTERS
      </span>
      <v-text-field
        solo
        rounded
        single-line
        clearable
        prepend-inner-icon="mdi-magnify"
        placeholder="Search"
        color="primary"
        class="mt-4 flex-grow-0 flex-shrink-1"
        v-model="searchField"
      ></v-text-field>
      <v-divider color="primary--text"></v-divider>
      <v-select
        v-model="categorySelect"
        :items="categories"
        label="Category"
        multiple
        chips
        deletable-chips
        no-hint
        no-title
        color="primary"
        class="flex-grow-0 flex-shrink-1"
      ></v-select>
      <!--
        add to the above once store is setup
        :events="functionEvents"
        :event-color="date => date[9] % 2 ? 'red' : 'yellow'"
      -->
      <v-subheader>DATE RANGE</v-subheader>
      <v-date-picker
        v-model="dateRange"
        range
        color="primary"
        class="flex-grow-0 flex-shrink-1"
      ></v-date-picker>
      <v-text-field
        v-model="dateRangeText"
        no-label
        prepend-icon="mdi-calendar-range"
        readonly
      ></v-text-field>
      <v-card flat class="d-flex flex-grow-1 align-end justify-center ma-3">
        <v-btn color="primary" block>RESET FILTERS</v-btn>
      </v-card>
    </v-card>
  </v-navigation-drawer>
</template>
<script>
import { mapState } from "vuex";

export default {
  props: ["events", "value"],
  data: () => ({
    filterCategorySelect: [],
    filterSearchInput: null
  }),
  computed: {
    ...mapState({
      categories: state => state.eventsFilterCategories
    }),
    categorySelect: {
      get() {
        return this.$store.state.filterCategorySelect;
      },
      set(val) {
        this.$store.commit("categorySelect", val);
      }
    },
    dateRangeText() {
      return this.dateRange.length === 2
        ? this.dateRange.join(" ~ ")
        : "select range above";
    },
    dateRange: {
      get() {
        return this.$store.state.eventsFilterDateRange;
      },
      set(val) {
        this.$store.commit("eventsFilterDateRange", val);
      }
    },
    searchField: {
      get() {
        return this.$store.state.eventsFilterSearchbox;
      },
      set(val) {
        this.$store.commit("eventsFilterSearchbox", val);
      }
    }
  }
};
</script>
