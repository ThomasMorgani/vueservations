<template>
  <v-menu :close-on-content-click="false" bottom auto offset-y>
    <template v-slot:activator="{ on }">
      <v-sheet
        v-on="on"
        color="transparent"
        height="48"
        width="48"
        class="d-flex align-center justify-center hoverPointer"
      >
        <v-tooltip color="primary" bottom>
          <template v-slot:activator="{ on }">
            <v-sheet
              v-on="on"
              color="transparent"
              class="d-flex align-center justify-center"
            >
              <v-icon color="primary">{{
                sortOptions[sort.value].icon
              }}</v-icon>
              <v-icon color="primary" class="ml-n2">{{
                `mdi-arrow-${sort.direction > 0 ? 'up' : 'down'}-thin`
              }}</v-icon>
            </v-sheet>
          </template>
          <span v-html="btnTooltipText"></span>
        </v-tooltip>
      </v-sheet>
    </template>
    <v-list>
      <v-list-item
        v-for="sortItem in Object.values(sortOptions)"
        :key="sortItem.value"
        @click="sort = sortItem.value"
      >
        <v-tooltip :color="sortItem.disabled ? '' : 'primary'" right>
          <template v-slot:activator="{ on }">
            <v-sheet v-on="on" color="transparent" width="100%">
              <v-icon
                :color="sortItem.value === sort.value ? 'primary' : 'disabled'"
                >{{ sortItem.icon }}</v-icon
              >
              <v-icon v-show="sortItem.value === sort.value" class="ml-n2">{{
                `mdi-arrow-${sort.direction > 0 ? 'up' : 'down'}-thin`
              }}</v-icon>
            </v-sheet>
          </template>
          <span>{{
            `${sortItem.text} (${sort.direction > 0 ? 'Asc' : 'Desc'})`
          }}</span>
        </v-tooltip>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'btnSortMenu',
  computed: {
    ...mapState({
      sortOptions: state => state.sortOptions
    }),
    btnTooltipText() {
      return `<strong>Sort</strong> <br /> (${
        this.sortOptions[this.sort.value].text
      } ${this.sort.direction > 0 ? 'Asc' : 'Desc'})`
    },
    sort: {
      get() {
        return this.$store.state.sort
      },

      set(v) {
        this.$store.dispatch('setStateValue', {
          key: 'sort',
          value: {
            direction:
              this.sort.value !== v
                ? this.sort.direction
                : this.sort.direction === 1
                ? -1
                : 1,
            value: v
          }
        })
        this.$store.dispatch('localStorageWrite', {
          key: 'calendarSort',
          data: this.sort
        })
      }
    }
  },
  created() {
    const lastSort = JSON.parse(localStorage.getItem('calendarSort')) || null
    if (lastSort?.value)
      this.$store.dispatch('setStateValue', {
        key: 'sort',
        value: lastSort
      })
  }
}
</script>

<style></style>
