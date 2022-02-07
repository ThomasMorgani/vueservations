<template>
  <v-card>
    <v-card-title class="justify-center primary--text">
      CHECK AVAILABILITY
    </v-card-title>
    <v-card-text>
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
          <v-col cols="10" class="text-center mt-6">
            <p>
              Use the calendar above to find days this item is available for
              reservation. Dark, black dates signify availability.
            </p>
            <p class="font-weight-bold">
              To place reservations or inquiries please call the library.
            </p>
            <v-btn block color="primary" href="tel:631-581-9200">
              <v-icon left>mdi-phone</v-icon>631-581-9200
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
    isLoading: true,
    modalEndDate: false,
    modalStartDate: false,
    reservations: [],
    startDate: null,
    valid: true
  }),
  computed: {
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
      const events = this.reservations.filter(e => {
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
      return events.length >= this.reservations.length
      // return val && true

      // const endDate = this.endDate || '3000-01-01'
      // const endTime = this.endTime || '00:00'
      // const endDateTime = new Date(endDate + 'T' + endTime)
      // if (this.ciSelected) {
      //   const ci = { ...this.ciSelected }
      //   events = this.events.filter(e => {
      //     if (e.item_id === ci.id) {
      //       return (
      //         !filters.testRangeOverlap(
      //           e.start_date,
      //           e.end_date,
      //           startDateTime,
      //           startDateTime,
      //           // this.allDay
      //           // ci.reservation_buffer
      //           1
      //         ) || e.id == this.id
      //       )
      //     } else {
      //       return true
      //     }
      //   })
      //   return (
      //     events.length >= this.events.length &&
      //     startDateTime.getTime() < endDateTime.getTime()
      //   )
      // } else {
      //   return true
      // }
    },
    thumbnailSrc() {
      return this.item.image_data.src
    }
  },
  mounted() {
    //PICKUP HERE
    // this.axios
    //   .get('https://www.eipl.org/api/Org/lotReservations/' + this.item.id)
    //   .then(resp => {
    //     if (resp?.data) {
    //       this.reservations = resp.data || []
    //     }
    //     this.isLoading = false
    //     console.log(resp)
    //   })
    //   .catch(err => console.error(err))
  }
}
</script>

<style lang="scss" scoped></style>
