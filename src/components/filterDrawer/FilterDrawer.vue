<template>
  <v-navigation-drawer
    :value="show"
    app
    clipped
    right
    stateless
    @input="$emit('input')"
    width="350"
  >
    <v-sheet height="40" class="d-flex align-center justify-space-between pa-2">
      <span class="title font-weight-bold align-center primary--text">FILTERS</span>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              color="error"
              :disabled="!isFiltered"
              @click="$store.dispatch('filtersClearAll')"
            >
              <v-icon color="error" left>mdi-filter-remove</v-icon>CLEAR
            </v-btn>
          </div>
        </template>
        <span>{{ isFiltered ? 'Clear Filters' : '0 filters applied' }}</span>
      </v-tooltip>
    </v-sheet>
    <v-sheet :style="styleFiltersSheet">
      <component :is="filterComp"></component>
    </v-sheet>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    calendar: () => import('@/components/filterDrawer/calendarFilters'),
    catalog: () => import('@/components/filterDrawer/catalogFilters')
  },
  computed: {
    ...mapGetters(['filtersApplied']),
    ...mapState({
      contentHeight: state => state.content.main.y,
      show: state => state.sideDrawer
    }),
    contentHeight() {
      return this.$store.state.content.main.y
    },
    isFiltered() {
      return this.filtersApplied.length > 0
    },
    filterComp() {
      switch (this.viewMain) {
        case 'calendar':
          return 'calendar'
        case 'catalog':
          return 'catalog'
      }
      return null
    },
    styleFiltersSheet() {
      let height = this.contentHeight || null
      if (height) {
        height = height - 160
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    },
    viewMain() {
      return this.$store.state.viewMain
    }
  }
}
</script>
<style scoped></style>
