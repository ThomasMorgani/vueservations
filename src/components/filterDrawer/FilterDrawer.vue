<template>
  <v-navigation-drawer
    :value="show"
    app
    clipped
    right
    stateless
    @input="$emit('input')"
    width="350"
    height="contentHeight"
  >
    <v-sheet height="40" class="d-flex align-center justify-space-between pa-2">
      <v-sheet
        color="transparent"
        @click="$store.dispatch('toggleStateValue', 'sideDrawer')"
        class="d-flex font-weight-bold align-center primary--text"
      >
        <filterBtn :btnProps="{ small: true }"></filterBtn>
        FILTERS</v-sheet
      >
      <v-tooltip color="primary" left>
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
      <v-expand-transition hide-on-leave origin="bottom center 0">
        <component :is="filterComp"></component>
      </v-expand-transition>
    </v-sheet>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import filterBtn from '@/components/global/buttons/filterDrawerToggle'
export default {
  components: {
    calendar: () => import('@/components/filterDrawer/calendarFilters'),
    catalog: () => import('@/components/filterDrawer/catalogFilters'),
    filterBtn
  },
  computed: {
    ...mapGetters(['filtersApplied']),
    ...mapState({
      contentHeight: state => state.content.main.y,
      viewMain: state => state.viewMain,
      catalogView: state => state.viewMain,
      sideDrawer: state => state.sideDrawer
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
    show() {
      return (
        this.sideDrawer &&
        (this.viewMain === 'calendar' ||
          (this.viewMain === 'catalog' && this.catalogView !== 'category'))
      )
    },
    styleFiltersSheet() {
      let height = this.contentHeight || null
      if (height) {
        height = height - 180
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  }
}
</script>
<style scoped></style>
