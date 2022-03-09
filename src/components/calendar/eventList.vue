<template>
  <v-card flat tile min-width="100%" width="100%">
    <!-- <v-card-title>
      Events for 'Date'
    </v-card-title> -->
    <v-card-text class="d-flex flex-wrap justify-center">
      <v-scroll-y-transition
        group
        hide-on-leave
        mode="out-in"
        origin="center center"
        class="transEl"
      >
        <p
          v-if="eventsDisplayed.length < 1"
          key="elNoResults"
          class="text-center primary--text"
        >
          No events found.
        </p>
        <eventListItem
          v-for="event in eventsDisplayed"
          :key="event.id"
          :event="event"
          @showDetails="$emit('showDetails', $event)"
        >
          //event buttons
        </eventListItem>
      </v-scroll-y-transition>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue2Filters from 'vue2-filters'
// import filters from '@/modules/filters.js'
import { mapState } from 'vuex'

import eventListItem from '@/components/calendar/eventListItem'
export default {
  props: {
    dateRange: {
      type: Object,
      default: () => ({})
    },
    events: {
      type: Array,
      default: () => []
    }
  },
  mixins: [Vue2Filters.mixin],
  components: {
    eventListItem
  },
  computed: {
    ...mapState(['sort']),
    eventsDisplayed() {
      return this.sortItems(this.events)
    }
  },
  methods: {
    sortItems(events = []) {
      const sort = {
        ci: ({ direction }, events) => {
          return this.orderBy(events, 'ciData.name', direction)
        },
        event: ({ direction }, events) => {
          return this.orderBy(events, 'start_date', direction)
        },
        patron: ({ direction }, events) => {
          return this.orderBy(events, 'patronData.last_name', direction)
        }
      }
      return sort[this.sort.value](this.sort, events) || events
    }
  }
}
</script>

<style scoped>
.transEl {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  width: 100%;
}
</style>
