<template>
  <v-btn icon @click="toggle">
    <v-icon color="primary">{{
      isActive ? 'mdi-filter-remove' : 'mdi-filter'
    }}</v-icon>
  </v-btn>
</template>

<script>
//TODO ADD TOOLTIP
//COLORS FOR ACTIVE FILTERS, BADGE MAYBE?
export default {
  name: 'filterDrawerToggle',
  computed: {
    isActive() {
      return this.$store.state.sideDrawer
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
