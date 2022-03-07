<template>
  <v-card flat tile>
    <!-- <v-card-title>
      Events for 'Date'
    </v-card-title> -->
    <v-card-text>
      <p v-if="eventsDisplayed.length < 1" class="text-center primary--text">
        No events results found.
      </p>
      <eventListItem
        v-for="event in eventsDisplayed"
        :key="event.id"
        :event="event"
        @showDetails="$emit('showDetails', $event)"
      >
        //event buttons
      </eventListItem>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue2Filters from 'vue2-filters'
import filters from '@/modules/filters.js'
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
      const startTime = this.dateRange?.start.date
      const endTime = this.dateRange?.end.date
      const events = this.events.filter(e =>
        filters.testRangeOverlap(startTime, endTime, e.start_date, e.end_date)
      )
      return this.sortItems(events)
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

<style></style>
