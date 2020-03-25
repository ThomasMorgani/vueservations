<template>
  <v-card>
    <v-card-title class="title primary--text "> </v-card-title>
    <v-card-text>
      <v-expansion-panels flat>
        <v-expansion-panel ref="panel" flat>
          <v-expansion-panel-header class="pa-2">
            <v-row dense align="center" justify="center">
              <v-col cols="2" align-self="center" class="d-flex justify-center">
                <v-img
                  contain
                  :src="item.image_data.src"
                  :max-width="$vuetify.breakpoint.smAndDown ? 75 : 100"
                  :max-height="$vuetify.breakpoint.smAndDown ? 75 : 100"
                  class="pa-0"
                ></v-img>
              </v-col>
              <v-col cols="10">
                <v-row dense class="display-flex align-center justify-start">
                  <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
                  <span class="font-weight-medium title primary--text">
                    {{ item.name }}
                  </span>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        label
                        small
                        :color="item.color ? item.color : 'grey'"
                        v-text="item.abbreviation"
                        class="font-weight-bold white--text mx-2"
                        v-on="on"
                      ></v-chip>
                    </template>
                    <span>
                      <p>
                        <strong>Abbreviation:</strong>
                        {{ item.abbreviation }}
                      </p>
                      <p>
                        <strong>Color:</strong>
                        {{ item.color }}
                      </p>
                      <div
                        :style="{
                          height: '10px',
                          'background-color': item.color
                        }"
                      ></div>
                    </span>
                  </v-tooltip>
                </v-row>

                <v-row dense class="display-flex align-center justify-start">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-avatar
                          size="10"
                          :color="categoriesById[item.category].color"
                          class="mr-1"
                        ></v-avatar>
                        <p
                          v-html="item.categoryName"
                          class="font-italic subheading text-capitalize"
                          style="display: inline;"
                        ></p>
                      </div>
                    </template>
                    <span>
                      <p class="mb-1">
                        <strong>Category</strong>
                      </p>
                      <v-avatar
                        size="15"
                        :color="categoriesById[item.category].color"
                        class="mr-1"
                      ></v-avatar>
                      {{ item.categoryName }}
                    </span>
                  </v-tooltip>
                </v-row>
                <v-row
                  dense
                  class="display-flex align-start justify-start my-2"
                >
                  <v-col class="text-xs-left">
                    <p
                      class="caption body-1 pa-2"
                      v-html="item.description"
                    ></p>
                  </v-col>
                </v-row>
                <v-row dense align="center" justify="start" class="my-2">
                  <!-- STATUS -->
                </v-row>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row dense justify="end">
              <v-col class="flex-grow-1 flex-shrink-0"></v-col>
              <v-col class="text-right flex-grow-0 flex-shrink-1">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      color="primary"
                      @click="showNotes"
                      v-on="on"
                    >
                      <v-icon color="primary">mdi-note-text-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Notes</span>
                </v-tooltip>
              </v-col>
              <v-col class="text-right flex-grow-0 flex-shrink-1">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn text icon @click="showReservations" v-on="on">
                      <v-icon color="primary">mdi-calendar-clock</v-icon>
                    </v-btn>
                  </template>
                  <span>View Reservations</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <v-row justify="start">
              <v-col cols="10" offset="2">
                <v-divider></v-divider>
                <p class="title font-weight-bold primary--text">DETAILS</p>
              </v-col>
              <v-col cols="8" offset="2" class="text-center">
                <customFieldsList :items="item.customFields"></customFieldsList>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { timestampHuman } from '@/modules/formats.js'

import customFieldsList from '@/components/catalog/catalogItem/ciCustomFieldsList'

export default {
  name: 'ciDetails',
  components: {
    customFieldsList
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['categoriesById']),
    ...mapState({
      categories: state => state.categories,
      statusData: state => state.statusData
    }),
    isReserved() {
      let reserved = false
      if (this.item.lastReservation) {
        const now = new Date()
        const endDate = new Date(this.item.lastReservation.end_date)
        if (endDate < now) {
          reserved = this.isReservedText()
        }
      }
      return reserved
    },
    status() {
      let data
      switch (this.item.status) {
        case 'blocked':
          data = this.statusData.blocked
          break
        case 'enabled':
          data = this.statusData.available

          break
        case 'disabled':
          data = this.statusData.disabled
          break
        default:
          data = this.statusData.unkown
          break
      }
      return data
    }
  },
  methods: {
    isReservedText() {
      //merge this with last reservaiton method?
      const resData = this.item.lastReservation['0']
      console.log(resData)
      console.log(resData.start_date)
      let wYear =
        resData.start_date.substring(0, 4) !== resData.end_date.substring(0, 4)
      let dateStart = this.formatDate(resData.start_date, wYear, true)
      let dateEnd = this.formatDate(resData.end_date, wYear, true)
      let text = `<p class="mb-1"><strong>${resData.patronData['last_name']}, ${resData.patronData['first_name']}</strong></p><p class="mb-1">${dateStart} - ${dateEnd}</p>`
      // let text = `<p class="mb-1"><strong>${resData.patronData.last_name}, ${resData.patronData.first_name}</strong></p><p class="mb-1">${dateStart} - ${dateEnd}</p>`
      return text
    },
    formatDate(timestamp, withYear, withTime) {
      console.log(timestamp)
      return timestampHuman(timestamp, withYear, withTime)
    },
    lastReservedText() {
      //merge this with last reservaiton method?
      return `<p class="mb-1"><strong>Last Reservation:</strong></p><p class="mb-1">${
        this.item.lastReservation ? this.isReservedText() : 'None'
      }</p>`
    },
    showNotes() {
      this.$emit('showItemNotes', this.item)
    },
    showReservations() {
      this.$emit('showItemReservations', this.item)
    }
  },
  created() {
    console.log(this.item)
  }
}
</script>

<style></style>
