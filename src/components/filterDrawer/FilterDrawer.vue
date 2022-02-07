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
        class="d-flex font-weight-bold align-center primary--text"
      >
        <filterBtn
          :btnProps="{ small: true }"
          :tooltipText="
            isFiltered
              ? 'Hide filter drawer. <br /> (retains applied filters)'
              : ''
          "
        ></filterBtn>
        <v-sheet color="transparent" class="text-h6 primary--text ml-6"
          >FILTERS</v-sheet
        >
      </v-sheet>

      <btn-with-tooltip
        :btnProps="{ color: 'error', disabled: !isFiltered }"
        btnText="CLEAR"
        :iconProps="{ color: 'error', icon: 'mdi-filter-remove', small: true }"
        :tooltipProps="{ bottom: true }"
        :tooltipText="
          !isFiltered
            ? '0 filters applied'
            : filtersApplied.length === 1
            ? 'Clear applied filter'
            : `Clear ${filtersApplied.length} applied filters`
        "
        @click="$store.dispatch('filtersClearAll')"
      ></btn-with-tooltip>
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
import filterBtn from '@/components/global/buttons/btnFilterDrawerToggle'
export default {
  name: 'FiltersDrawer',
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
      filterDrawer: state => state.filterDrawer
    }),
    contentHeight() {
      return this.$store.state.content.main.y
    },
    isFiltered() {
      return this.filtersApplied.length > 0
    },
    filterComp() {
      const filterMap = {
        Calendar: 'calendar',
        Catalog: 'catalog'
      }
      return filterMap[this.$route.name] || null
    },
    show() {
      return (
        this.filterDrawer &&
        (this.$route.name === 'Calendar' || this.$route.name === 'Catalog')
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
