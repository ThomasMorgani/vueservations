<template>
  <v-card tile class="mt-2">
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
        <v-col cols="10" class="d-flex flex-column align-start justify-start">
          <v-sheet
            color="transparent"
            class="d-flex flex-row align-center justify-space-between primary--text font-weight-bold text-subtitle-1"
          >
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  color="primary"
                  @click="$emit('showDetails', { type: 'ci', event: event })"
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

            {{ formatTimeStamp(event.start_date) || '' }} -
            {{ formatTimeStamp(event.end_date) || '' }}
          </v-sheet>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { eventPreview, timestampHuman } from '@/modules/formats'
import ciHeading from '@/components/catalog/catalogItem/ciHeading.vue'
export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  components: {
    ciHeading
  },
  methods: {
    formatEvent(e) {
      console.log(eventPreview(e))
      // formats.eventPreview(e, this.categories)
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
