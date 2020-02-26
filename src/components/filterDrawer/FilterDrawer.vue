<template>
  <v-navigation-drawer
    :value="show"
    app
    clipped
    right
    @input="$emit('input')"
    width="350"
  >
    <component :is="filterComp"></component>
  </v-navigation-drawer>
</template>
<script>
export default {
  props: ['value'],
  components: {
    calendar: () => import('@/components/filterDrawer/calendarFilters'),
    catalog: () => import('@/components/filterDrawer/catalogFilters')
  },
  computed: {
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
      return this.$store.state.sideDrawer
    },
    viewMain() {
      return this.$store.state.viewMain
    }
  }
}
</script>
