<template>
  <v-card tile>
    <modal-title text="CHECK AVAILABILITY"></modal-title>
    <v-card-text class="pt-4">
      <v-row dense align="center" justify="start">
        <v-col cols="2" align-self="center" class="d-flex justify-center">
          <v-img
            contain
            height="70"
            :src="thumbnailSrc()"
            class="pa-0 "
          ></v-img>
        </v-col>
        <v-col cols="8" class="ml-3">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text">
              {{ item.name }}
            </span>
          </v-row>
          <v-row
            dense
            class="display-flex flex-column align-start justify-start"
          >
            <div>
              <v-avatar
                size="10"
                :color="categoriesById[item.category].color"
                class="mr-1"
              ></v-avatar>
              <p
                v-html="categoriesById[item.category].name"
                class="font-italic subheading text-capitalize"
                style="display: inline;"
              ></p>
            </div>
            <p>{{ `Reservation period: ${item.reservation_length} Days` }}</p>
          </v-row>
        </v-col>
      </v-row>
      <form>
        <v-row align="center" justify="center" dense>
          <v-col cols="12" class="text-center ">
            <v-progress-circular
              v-if="isLoading"
              color="primary"
              indeterminate
            ></v-progress-circular>
            <v-date-picker
              v-else
              :allowed-dates="allowedStart"
              full-width
              no-title
              readonly
              class="mt-6"
            ></v-date-picker>
          </v-col>
          <v-col cols="10" class="text-center ">
            <p class="py-4">
              Use the calendar above to find days this item is available for
              reservation. Dark, black dates signify availability.
            </p>

            <v-btn block color="primary">
              <v-icon left>mdi-calendar-outline</v-icon>RESERVE
            </v-btn>
          </v-col>
        </v-row>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import filters from '@/modules/filters'
import { mapState } from 'vuex'
// import * as formats from '@/modules/formats.js'

export default {
  name: 'ciAvailability',
  props: {
    categoriesById: {
      type: Object,
      required: true
    },

    item: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    endDate: null,
    isLoading: false,
    modalEndDate: false,
    modalStartDate: false,
    startDate: null,
    valid: true
  }),
  computed: {
    ...mapState({
      events: state => state.events
    }),
    formErrors() {
      return {
        endDate: '',
        startDate: ''
      }
    }
  },
  methods: {
    allowedStart(val) {
      const startDate = val || '1980-01-01'
      const startTime = '00:00'
      const startDateTime = new Date(startDate + 'T' + startTime)
      const events = this.events.filter(e => {
        return !filters.testRangeOverlap(
          e.start_date,
          e.end_date,
          startDateTime,
          startDateTime,
          // this.allDay
          // ci.reservation_buffer
          1
        )
      })
      return events.length >= this.events.length
    },
    thumbnailSrc() {
      return this.item.image_data.src
    }
  }
}
</script>

<style lang="scss" scoped></style>
