<template>
  <v-card>
    <!-- <v-card-title>
      Events for 'Date'
    </v-card-title> -->
    <v-card-text>
      event list
      <eventListItem v-for="n in 40" :key="n" :event="{}"></eventListItem>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary">CLOSE</v-btn>
    </v-card-actions>
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
      const startTime = this.dateRange.start.date
      const endTime = this.dateRange.end.date
      return this.events.filter(e =>
        filters.testRangeOverlap(startTime, endTime, e.start_date, e.end_date)
      )
    }
  }
}
</script>

<style></style>
