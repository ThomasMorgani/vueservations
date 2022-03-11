<template>
  <v-card max-width="900" tile width="100%" class="mt-2">
    <v-card-text>
      <v-row dense align="center" justify="center">
        <v-col cols="2" align-self="center" class="d-flex justify-center pa-2">
          <v-img
            contain
            :src="event.ciData.image_data.src"
            :max-width="$vuetify.breakpoint.smAndDown ? 75 : 100"
            :max-height="$vuetify.breakpoint.smAndDown ? 75 : 100"
            class="pa-0"
          ></v-img>
          <!-- @click.stop="$emit('showImage', item.image_data)" -->
        </v-col>
        <v-col cols="8">
          <v-sheet
            height="110"
            class="d-flex flex-column align-start justify-space-between"
          >
            <v-sheet
              color="transparent"
              class="d-flex flex-row align-center justify-space-between primary--text font-weight-bold text-subtitle-1"
            >
              <!-- ITEM DETAILS BTN -->
              <v-tooltip color="primary" top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="primary"
                    @click="
                      $emit('showDetails', {
                        type: 'ci',
                        event: { eventData: event }
                      })
                    "
                    v-on="on"
                    class="mr-2"
                  >
                    <v-icon>mdi-layers-search</v-icon>
                  </v-btn>
                </template>
                <span>Catalog item details</span>
              </v-tooltip>

              <ciHeading :item="event.ciData" :showCategory="false"></ciHeading>
            </v-sheet>
            <v-sheet
              color="transparent"
              class="d-flex flex-row align-center primary--text font-weight-bold text-subtitle-1"
            >
              <!-- PATRON DETAILS BTN -->
              <v-tooltip color="primary" top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="primary"
                    @click="
                      $emit('showDetails', {
                        type: 'patron',
                        event: { eventData: event }
                      })
                    "
                    v-on="on"
                    class="mr-2"
                  >
                    <v-icon>mdi-account-search</v-icon>
                  </v-btn>
                </template>
                <span>Patron Details</span>
              </v-tooltip>

              {{ event.patronData.last_name || '' }},
              {{ event.patronData.first_name || '' }}
            </v-sheet>
            <v-sheet
              color="transparent"
              class="d-flex flex-row align-center primary--text  text-subtitle-2"
            >
              <!-- EVENTS DETAILS BTN -->
              <v-tooltip color="primary" top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    color="primary"
                    @click="
                      $emit('showDetails', {
                        type: 'event',
                        event: { eventData: event }
                      })
                    "
                    v-on="on"
                    class="mr-2"
                  >
                    <v-icon>mdi-calendar-search</v-icon>
                  </v-btn>
                </template>
                <span>Event Details</span>
              </v-tooltip>
              {{ eventTimeText() }}
            </v-sheet>
          </v-sheet>
        </v-col>
        <v-col cols="2">
          <v-sheet
            height="110"
            class="d-flex flex-column align-end justify-space-between"
          >
            <event-status
              :avatarSize="15"
              :eventData="event"
              :withLabel="false"
            ></event-status>
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { eventPreview, timestampHuman } from '@/modules/formats'
import ciHeading from '@/components/catalog/catalogItem/ciHeading.vue'
import eventStatus from '@/components/calendar/eventStatus.vue'
export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  components: {
    ciHeading,
    eventStatus
  },
  methods: {
    formatEvent(e) {
      console.log(eventPreview(e))
      // formats.eventPreview(e, this.categories)
    },
    eventTimeText() {
      const end = this.formatTimeStamp(this.event.end_date)
      const start = this.formatTimeStamp(this.event.start_date)
      const isAllDay = this.event.isAllDay
      return `${isAllDay ? start.split(' ')[0] : start} - ${
        isAllDay ? end.split(' ')[0] : end
      } `
    },
    formatTimeStamp(timestamp) {
      return timestampHuman(timestamp)
    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
}</style
>>
