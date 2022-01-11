<template>
  <v-card width="800">
    <v-card-text class="pa-5">
      <v-row dense align="center" justify="center">
        <v-col cols="2" align-self="center" class="d-flex justify-center">
          <v-img
            contain
            height="70"
            :src="item.image_data.src"
            class="pa-0"
          ></v-img>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text ml-5">
              {{ item.name }}
            </span>
            <v-tooltip color="primary" top>
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
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-avatar
                    size="10"
                    :color="categoriesById[item.category].color"
                    class=" ml-5 mr-1"
                  ></v-avatar>
                  <p
                    v-html="categoriesById[item.category].name"
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
                {{ categoriesById[item.category].name }}
              </span>
            </v-tooltip>
          </v-row>
        </v-col>
      </v-row>
      <v-row dense justify="end">
        <v-col class="offset-2 text-left flex-grow-0 flex-shrink-1">
          <v-btn
            text
            color="primary"
            @click="showDetails = !showDetails"
            class="font-weight-bold primary--text"
            ><v-icon
              left
              color="primary"
              v-text="showDetails ? 'mdi-menu-up' : 'mdi-menu-down'"
            ></v-icon>
            DETAILS</v-btn
          >
        </v-col>
        <v-col class="flex-grow-1 flex-shrink-0"></v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip color="primary" top>
            <template v-slot:activator="{ on }">
              <v-btn text icon color="primary" @click="showNotes" v-on="on">
                <v-icon color="primary">mdi-note-text-outline</v-icon>
              </v-btn>
            </template>
            <span>Notes</span>
          </v-tooltip>
        </v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip color="primary" top>
            <template v-slot:activator="{ on }">
              <v-btn text icon @click="showReservations" v-on="on">
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </v-btn>
            </template>
            <span>View Reservations</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row dense justify="start" v-if="showDetails">
        <v-col cols="8" offset="2" class="text-left pt-0">
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="8" offset="2" class="text-left">
          <p class="caption body-1 pa-2" v-html="item.description"></p>
          <customFieldsList :items="item.custom_fields"></customFieldsList>
        </v-col>
      </v-row>
      <v-dialog
        v-model="modal"
        persistent
        max-width="600"
        transition="dialog-transition"
      >
        <v-card flat>
          <component
            :key="modal + modalComp"
            :is="modalComp"
            v-bind="modalCompData"
            @close="modal = false"
          ></component>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions v-if="withCardActions">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Vue2Filters from 'vue2-filters'
import * as formats from '@/modules/formats.js'
const { timestampHuman } = formats
import customFieldsList from '@/components/catalog/catalogItem/ciCustomFieldsList'

export default {
  name: 'ciDetails',
  components: {
    customFieldsList,
    ciNotes: () => import('@/components/catalog/catalogItem/ciNotes'),
    ciReservations: () =>
      import('@/components/catalog/catalogItem/ciReservations')
  },
  mixins: [Vue2Filters.mixin],
  props: {
    expandDetails: {
      type: Boolean,
      required: false,
      default: () => true
    },
    item: {
      type: Object,
      required: true
    },
    withCardActions: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  data: () => ({
    modal: false,
    modalComp: null,
    modalCompData: null,
    showDetails: true
  }),
  computed: {
    ...mapGetters(['categoriesById']),
    ...mapState({
      categories: state => state.categories,
      events: state => state.events,
      patrons: state => state.patrons,
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
      this.modalCompData = {
        catalogItem: this.item,
        tableData: {
          headers: [
            {
              value: 'note',
              text: 'NOTE'
            },
            {
              value: 'date_created',
              text: 'CREATED'
            },
            {
              value: 'date_updated',
              text: 'UPDATED'
            }
          ],
          items: this.orderBy(
            formats.noteListSimple(this.item.notes),
            'date_created'
          ),
          height: 400
        }
      }
      this.modalComp = 'ciNotes'
      this.modal = true
    },
    showReservations() {
      this.modalCompData = {
        catalogItem: this.item,
        tableData: {
          headers: [
            {
              value: 'patron',
              text: 'PATRON'
            },
            {
              value: 'startDate',
              text: 'START'
            },
            {
              value: 'endDate',
              text: 'END'
            }
          ],
          items: this.orderBy(
            formats.eventListSimple(
              this.events.filter(e => e.item_id == this.item.id),
              this.patrons
            ),
            'startDate'
          ),
          height: 400
        }
      }
      this.modalComp = 'ciReservations'
      this.modal = true
    }
  },
  created() {
    if (!this.expandDetails) {
      this.showDetails = false
    }
  }
}
</script>

<style></style>
