<template>
  <v-tooltip top :disabled="!isFiltered">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-btn text icon @click="toggle" :disabled="isDisabled">
          <v-icon :color="isFiltered ? 'success' : 'primary'">
            {{ isActive ? 'mdi-filter-minus' : 'mdi-filter' }}
          </v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{
      isFiltered
        ? `${filtersApplied.length} filter${
            filtersApplied.length === 1 ? '' : 's'
          } applied`
        : ''
    }}</span>
  </v-tooltip>
</template>

<script>
//TODO ADD TOOLTIP
//COLORS FOR ACTIVE FILTERS, BADGE MAYBE?
export default {
  name: 'filterDrawerToggle',
  computed: {
    isActive() {
      return this.$store.state.sideDrawer
    },
    isDisabled() {
      //TODO: MAKE MORE GENERAL FOR IF THIS IS AVAILABLE ESLEWHERE
      return this.viewCatalog === 'category'
    },
    filtersApplied() {
      return this.$store.getters.filtersApplied
    },
    isFiltered() {
      return this.filtersApplied.length > 0
    },
    viewCatalog() {
      return this.$store.state.catalogView
    },
    viewMain() {
      return this.$store.state.viewMain
    },
    viewSub() {
      return this.$store.state.viewSub
    }
  },
  methods: {
    toggle() {
      this.$store.dispatch('toggleStateValue', 'sideDrawer')
    }
  }
}
</script>

<style></style>
