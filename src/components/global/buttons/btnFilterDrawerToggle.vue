<template>
  <v-tooltip color="primary" bottom>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-btn
          v-bind="{ color: 'primary', icon: true, ...btnProps }"
          @click="toggle"
        >
          <v-icon :color="isFiltered ? 'success' : 'primary'">
            {{ isActive ? 'mdi-filter-minus' : 'mdi-filter' }}
          </v-icon>
        </v-btn>
      </div>
    </template>
    <v-sheet
      color="transparent"
      width="100%"
      v-html="tooltipTextDisplayed()"
      class="text-no-wrap secondary--text"
    ></v-sheet>
  </v-tooltip>
</template>

<script>
//TODO: PULL IN BtnWithTooltip, BADGE MAYBE?
export default {
  name: 'btnFilterDrawerToggle',
  props: {
    btnProps: {
      type: Object,
      default: () => ({})
    },
    tooltipText: {
      type: String,
      required: false
    }
  },
  computed: {
    isActive() {
      return this.$store.state.filterDrawer
    },
    filtersApplied() {
      return this.$store.getters.filtersApplied
    },
    isFiltered() {
      return this.filtersApplied.length > 0
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
      localStorage.setItem('filterDrawer', !this.isActive)
      this.$store.dispatch('toggleStateValue', 'filterDrawer')
    },
    tooltipTextDisplayed() {
      return this.tooltipText
        ? this.tooltipText
        : this.isFiltered
        ? `${this.filtersApplied.length} filter${
            this.filtersApplied.length === 1 ? '' : 's'
          } applied`
        : `${this.isActive ? 'Hide' : 'Show'} filter drawer`
    }
  }
}
</script>

<style></style>
