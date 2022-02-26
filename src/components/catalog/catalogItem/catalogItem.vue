<template>
  <v-expansion-panel ref="panel">
    <v-expansion-panel-header class="pa-2">
      <v-row dense align="center" justify="center">
        <v-col cols="2" align-self="center" class="d-flex justify-center pa-2">
          <v-img
            contain
            :src="thumbnailSrc"
            :max-width="$vuetify.breakpoint.smAndDown ? 75 : 100"
            :max-height="$vuetify.breakpoint.smAndDown ? 75 : 100"
            @click.stop="$emit('showImage', item.image_data)"
            class="pa-0"
          ></v-img>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-start justify-start my-2">
            <v-col class="text-xs-left">
              <CiHeading :item="item"></CiHeading>

              <p class="caption body-1 pa-2" v-html="item.description"></p>
            </v-col>
          </v-row>
          <v-row dense align="center" justify="start" class="my-2">
            <!-- STATUS -->
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  :color="status.color"
                  class="mr-3"
                  v-on="on"
                  @click.stop="reserve(item)"
                >
                  <v-icon left v-text="status.icon"></v-icon>
                  {{ status.text }}
                  <!-- <p v-text="status.text" :class="` ml-1 font-weight-bold ${status.color}--text`"></p> -->
                </v-btn>
              </template>
              <span v-html="status.popovertext"></span>
            </v-tooltip>
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  color="primary"
                  class="mr-3"
                  v-on="on"
                  @click.stop="showReservations"
                >
                  <v-icon left v-text="'mdi-history'"></v-icon>
                  {{
                    item.lastReservation
                      ? formatDate(item.lastReservation.start_date, true, false)
                      : 'N/A'
                  }}
                  <!-- <p v-text="status.text" :class="` ml-1 font-weight-bold ${status.color}--text`"></p> -->
                </v-btn>
              </template>
              <span v-html="lastReservedText()"></span>
            </v-tooltip>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense justify="end">
        <v-col cols="2"> </v-col>
        <v-col cols="10" class="d-flex align-end justify-space-between">
          <v-sheet class="d-flex flex-column align-start justify-start">
            <p>
              <span class="text-body-1 font-weight-bold primary--text">
                ITEM VISIBILITY:
              </span>
              {{ item.internal === '0' ? 'Publicly listed' : 'Internal use' }}
            </p>
            <p>
              <span class="text-body-1 font-weight-bold primary--text">
                RESERVATION LENGTH:
              </span>
              {{ reservationText(item.reservation_length) }}
            </p>
            <p>
              <span class="text-body-1 font-weight-bold primary--text">
                RESERVATION BUFFER:
              </span>
              {{ reservationText(item.reservation_buffer) }}
            </p>
          </v-sheet>
          <v-spacer></v-spacer>
          <v-sheet>
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-btn text icon color="primary" @click="showNotes" v-on="on">
                  <v-icon color="primary">mdi-note-text-outline</v-icon>
                </v-btn>
              </template>
              <span>Notes</span>
            </v-tooltip>
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-btn text icon @click="showReservations" v-on="on">
                  <v-icon color="primary">mdi-calendar-clock</v-icon>
                </v-btn>
              </template>
              <span>View Reservations</span>
            </v-tooltip>
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-btn text icon color="primary" @click="edit" v-on="on">
                  <v-icon color="primary">mdi-square-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Edit Item</span>
            </v-tooltip>
          </v-sheet>
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
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { timestampHuman } from '@/modules/formats.js'

import customFieldsList from '@/components/catalog/catalogItem/ciCustomFieldsList'
import CiHeading from '@/components/catalog/catalogItem/ciHeading'
export default {
  name: 'catalogItem',
  components: {
    CiHeading,
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
        const startDate = new Date(this.item.lastReservation.start_date)
        const endDate = new Date(this.item.lastReservation.end_date)
        if (startDate < now && endDate > now) {
          reserved = this.isReservedText()
        }
      }
      return reserved
    },
    status() {
      let data
      if (this.item.isAvailable) {
        data = this.statusData.enabled

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
      } else {
        data = {
          ...this.statusData.unavailable,
          popovertext: this.isReservedText()
        }
      }
      return data
    },
    thumbnailSrc() {
      return this.item.image_data.src
    },
    thumbnailMaxHeight() {
      return 50
    }
  },
  methods: {
    edit() {
      this.$store.dispatch('setStateValue', {
        key: 'catalogItemEditing',
        value: { ...this.item }
      })
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogItemEdit')
      }, 500)
    },
    isReservedText() {
      //merge this with last reservaiton method?
      const resData = this.item.lastReservation
      let wYear =
        resData.start_date.substring(0, 4) !== resData.end_date.substring(0, 4)
      let dateStart = this.formatDate(resData.start_date, wYear, true)
      let dateEnd = this.formatDate(resData.end_date, wYear, true)
      let text = `<p class="mb-1"><strong>${resData.patronData['last_name']}, ${resData.patronData['first_name']}</strong></p><p class="mb-1">${dateStart} - ${dateEnd}</p>`
      // let text = `<p class="mb-1"><strong>${resData.patronData.last_name}, ${resData.patronData.first_name}</strong></p><p class="mb-1">${dateStart} - ${dateEnd}</p>`
      return text
    },
    formatDate(timestamp, withYear, withTime) {
      return timestampHuman(timestamp, withYear, withTime)
    },
    lastReservedText() {
      //merge this with last reservaiton method?
      return `<p class="mb-1"><strong>Last Reservation:</strong></p><p class="mb-1">${
        this.item.lastReservation ? this.isReservedText() : 'None'
      }</p>`
    },
    reserve(e) {
      this.$emit('reserve', e)
    },
    reservationText(num = null) {
      num = parseInt(num)
      if (isNaN(num)) return '-'
      return num === 1 ? `1 Day` : `${num} Days`
    },
    showNotes() {
      this.$emit('showItemNotes', this.item)
    },
    showReservations() {
      this.$emit('showItemReservations', this.item)
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
.v-application p {
  margin-bottom: 0px;
}
</style>
