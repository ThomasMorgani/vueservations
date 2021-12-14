<template>
  <v-card>
    <v-card-title
      v-text="`${id ? 'EDIT' : 'ADD NEW'} RESERVATION`"
      class="headline primary--text justify-center"
    ></v-card-title>
    <v-card-text style="max-width: 1000px; max-height: 70vh; overflow-y: auto;">
      <v-form ref="form" v-model="valid">
        <v-row align="center" justify="center">
          <v-col cols="8" class="pt-4 pb-0">
            <!--
              CATALOG ITEM MENU
            -->
            <v-autocomplete
              v-model="ciSelected"
              :items="orderBy(itemList, 'name', 1)"
              label="Catalog Item"
              item-text="name"
              item-value="name"
              item-disabled="isDisabled"
              :disabled="id !== null"
              outlined
              clearable
              prepend-icon="mdi-format-list-bulleted-type"
              return-object
              :filter="customFilter"
              :error-messages="formErrors.ciSelected"
            >
              <!-- selection -->
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar size="45">
                    <img :src="data.item.image" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="data.item.name"
                      class="font-weight-bold"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="
                        `${data.item.abbreviation}: ${data.item.category}`
                      "
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon
                      v-text="statusData[ciSelectedStatus].icon"
                      :color="statusData[ciSelectedStatus].color"
                    ></v-icon>
                  </v-list-item-action>
                </v-list-item>
              </template>
              <!-- items -->
              <template v-slot:item="data">
                <v-list-item-avatar size="45">
                  <img :src="data.item.image" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="data.item.name"
                    class="font-weight-bold"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    :class="
                      data.item.isDisabled ? 'text--disabled' : 'text--primary'
                    "
                    v-text="`${data.item.abbreviation}: ${data.item.category}`"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-list-item-action-text>{{
                    itemActionText(data.item)
                  }}</v-list-item-action-text>
                  <v-icon
                    v-text="statusData[data.item.status].icon"
                    :color="statusData[data.item.status].color"
                  ></v-icon>
                </v-list-item-action>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="8" class="text-xs-right py-0 mt-0">
            <!--
              PATRONMENU
            -->
            <v-autocomplete
              label="Patron"
              prepend-icon="mdi-account"
              v-model="patronSelected"
              outlined
              clearable
              :disabled="id !== null"
              :items="orderBy(patronList, 'last_name', 1)"
              item-text="last_name"
              item-value="id"
              return-object
              :filter="customFilter"
              :error-messages="formErrors.patronSelected"
              class="mt-4"
            >
              <template v-slot:append>
                <v-tooltip top v-if="!patronSelected">
                  <template v-slot:activator="{ on }">
                    <v-btn
                      text
                      icon
                      small
                      color="primary"
                      @click="modalPatronEdit = true"
                      v-on="on"
                    >
                      <v-icon color="primary">mdi-account-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Add New Patron</span>
                </v-tooltip>
              </template>
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="`${data.item.last_name}, ${data.item.first_name}`"
                      class="font-weight-bold"
                    ></v-list-item-title>
                    <v-list-item-subtitle
                      class="text--primary"
                      v-text="data.item.barcode"
                    ></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="`${data.item.last_name}, ${data.item.first_name}`"
                    class="font-weight-bold"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    class="text--primary"
                    v-text="data.item.barcode"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </template>
              <template v-slot:no-data>
                <v-sheet class="d-flex align-center justify-space-between pa-3">
                  <span class="font-weight-medium">
                    NO RESULTS FOUND.
                    <v-icon color="primary" class="ml-3 mr-1 mb-1"
                      >mdi-account-plus</v-icon
                    >TO ADD A NEW PATRON
                  </span>
                </v-sheet>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="5">
            <!--
              START DATE ++ TIME
            -->
            <v-dialog
              ref="startDateDialog"
              v-model="modalStartDate"
              :return-value.sync="startDate"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="startDate ? formatTimestamp(startDate) : null"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  clearable
                  @click:clear="clearValue('startDate')"
                  readonly
                  v-on="on"
                  :error-messages="formErrors.startDate"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                scrollable
                :allowed-dates="allowedStart"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalStartDate = false"
                  >Cancel</v-btn
                >
                <v-btn
                  text
                  color="primary"
                  @click="$refs.startDateDialog.save(startDate)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="5">
            <!--
              END DATE 
            -->
            <v-dialog
              ref="modalEndDateDialog"
              v-model="modalEndDate"
              :return-value.sync="endDate"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="endDate ? formatTimestamp(endDate) : null"
                  label="End Date"
                  prepend-icon="mdi-calendar"
                  clearable
                  @click:clear="clearValue('endDate')"
                  readonly
                  v-on="on"
                  :error-messages="formErrors.endDate"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                scrollable
                :allowed-dates="allowedEnd"
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalEndDate = false"
                  >Cancel</v-btn
                >
                <v-btn
                  text
                  color="primary"
                  @click="$refs.modalEndDateDialog.save(endDate)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-col>
          <!--
            TIMES
          -->
          <v-col
            cols="3"
            class="d-flex align-center  justify-center py-0"
            align-self="center"
          >
            <v-switch
              v-model="allDay"
              label="Full Day"
              color="primary"
              hide-details
              class="mt-0"
              @change="onAllDay"
            >
              <template v-slot:prepend>
                <div v-show="!allDay">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on" color="warning"
                        >mdi-alert-octagram
                      </v-icon>
                    </template>
                    Set start/end times first for accurate availability
                    reporting
                  </v-tooltip>
                </div>
              </template>
            </v-switch>
          </v-col>
          <v-col
            cols="7"
            align-self="center"
            class="d-flex align-center  justify-center py-0"
          >
            <v-alert
              :value="reservationLengthWarn !== false"
              border="left"
              color="warning"
              colored-border
              dense
              elevation="1"
              icon="mdi-alert"
              class="flex-grow-1 warning--text"
            >
              {{ reservationLengthWarn }}
            </v-alert>
          </v-col>

          <v-col cols="5" class="py-0" align-self="center">
            <v-dialog
              ref="startTimeDialog"
              v-model="modalStartTime"
              :return-value.sync="startTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="humanTime(startTime)"
                  label="Start Time"
                  prepend-icon="mdi-clock"
                  clearable
                  @click:clear="clearValue('startTime')"
                  readonly
                  v-on="on"
                  :disabled="allDay"
                  :error-messages="formErrors.startTime"
                ></v-text-field>
              </template>
              <v-time-picker v-if="modalStartTime" v-model="startTime">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalStartTime = false"
                  >Cancel</v-btn
                >
                <v-btn
                  text
                  color="primary"
                  @click="$refs.startTimeDialog.save(startTime)"
                  >OK</v-btn
                >
              </v-time-picker>
            </v-dialog>
          </v-col>

          <v-col cols="5">
            <v-dialog
              ref="dialog"
              v-model="modalEndTime"
              :return-value.sync="endTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="humanTime(endTime)"
                  label="End Time"
                  prepend-icon="mdi-clock"
                  clearable
                  @click:clear="clearValue('endTime')"
                  readonly
                  v-on="on"
                  :disabled="allDay"
                  :error-messages="formErrors.endTime"
                ></v-text-field>
              </template>
              <v-time-picker v-if="modalEndTime" v-model="endTime" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalEndTime = false"
                  >Cancel</v-btn
                >
                <v-btn text color="primary" @click="$refs.dialog.save(endTime)"
                  >OK</v-btn
                >
              </v-time-picker>
            </v-dialog>
          </v-col>

          <v-col cols="7">
            <!--
              NOTES
            -->
            <v-textarea
              v-model="notes"
              label="Notes"
              prepend-icon="mdi-note"
              rows="2"
              clearable
              class="mt-3"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="error darken-1"
        text
        :disabled="!id"
        @click="modalConfirmDelete = !modalConfirmDelete"
        >DELETE</v-btn
      >
      <v-btn
        color="warning darken-1"
        text
        :disabled="!isChanged"
        @click="resetChanges"
        >RESET</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('close')">CANCEL</v-btn>
      <v-btn
        color="success"
        text
        @click.native="modalAction('submit')"
        :disabled="saveDisabled"
      >
        <transition name="bounce-top">
          <v-icon v-if="!saveDisabled" left>mdi-content-save</v-icon>
        </transition>
        {{ id ? 'SAVE' : 'SUBMIT' }}
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="modalPatronEdit"
      transition="dialog-transition"
      max-width="800"
    >
      <patronEdit
        :key="modalPatronEdit"
        @close="modalPatronEdit = false"
        @patronAdded="onPatronAdd"
      ></patronEdit>
    </v-dialog>
    <v-dialog
      v-model="modalConfirmDelete"
      max-width="500px"
      transition="dialog-transition"
    >
      <!--TODO: Move to Component -->
      <v-card v-if="modalConfirmDelete">
        <v-card-title class="justify-center title error--text"
          >CONFIRM DELETE</v-card-title
        >
        <v-card-text>
          <v-row class="justify-center align-center">
            <v-col cols="12" class="align-center">
              <p class="font-weight-bold text-center mb-0">
                WARNING: You are about to delete reservation:
              </p>
              <p v-if="isChanged" class="text-center caption">
                (original reservation details below)
              </p>
              <p class="title font-weight-bold text-center mt-4">
                {{ originalValues.ciSelected.name }}
              </p>
              <p class="font-weight-bold text-center">
                {{
                  `${originalValues.patronSelected.last_name}, ${originalValues.patronSelected.first_name}`
                }}
              </p>
              <p class="font-weight-bold text-center">
                {{
                  `${formatTimestamp(
                    originalValues.startDate
                  )} - ${formatTimestamp(originalValues.endDate)}`
                }}
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn
            color="primary"
            text
            @click="modalConfirmDelete = !modalConfirmDelete"
            >CANCEL</v-btn
          >
          <v-btn color="error" text @click="deleteEvent">DELETE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters'
import * as formats from '@/modules/formats'
import Vue2Filters from 'vue2-filters'
export default {
  name: 'eventEdit',
  components: {
    // ciListMenu: () => import('@/components/global/listTiles')
    patronEdit: () => import('@/components/patron/patronEdit')
  },
  props: [],
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      allDay: true,
      ciSelected: null,
      endDate: null,
      endTime: null,
      id: null,
      modalConfirmDelete: false,
      modalEndDate: false,
      modalEndTime: false,
      modalPatronEdit: false,
      modalStartDate: false,
      modalStartTime: false,
      notes: '',
      originalValues: {
        allDay: true,
        ciSelected: null,
        id: null,
        endDate: null,
        endTime: null,
        patronSelected: null,
        startDate: null,
        startTime: null,
        notes: ''
      },
      patronSelected: null,
      startDate: null,
      startTime: null,
      valid: true
    }
  },
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      categories: state => state.categories,
      events: state => state.events,
      eventediting: state => state.eventediting,
      filter: state => state.filter,
      patrons: state => state.patrons,
      statusData: state => state.statusData
    }),
    endDateFormatted: {
      get() {
        if (!this.endDate) return null

        const [year, month, day] = this.endDate.split('-')
        return `${month}/${day}/${year}`
      },
      set(v) {
        this.endDate = v
      }
    },
    ciSelectedStatus() {
      if (!this.ciSelected) {
        return null
      } else {
        const id = this.ciSelected.id
        const item = filters.customfieldById(id, this.itemList)
        return item.status
      }
    },

    formErrors() {
      let errors = {}
      const requireds = [
        'patronSelected',
        'ciSelected',
        'startDate',
        'endDate',
        'patronSelected'
      ]
      requireds.forEach(key => {
        if (!this[key]) {
          errors[key] = ['Required']
        }
      })
      if (this.endDate && this.startDate) {
        let end = new Date(this.endDate)
        let start = new Date(this.startDate)
        if (end < start) {
          errors.endDate = ['End date must come after start.']
        } else {
          if (!this.allDay) {
            const startDateTime = new Date('1970-01-01T' + this.startTime + 'Z')
            const endDateTime = new Date('1970-01-01T' + this.endTime + 'Z')
            if (!this.startTime) {
              errors.startTime = ['Start time required if all day is off']
            }
            if (!this.endTime) {
              errors.endTime = ['End time required if all day is off']
            }
            if (startDateTime > endDateTime) {
              errors.endTime = ['End time must come after start.']
            }
          }
        }
        if (this.ciSelected) {
          const startDate = this.startDate || '1980-01-01'
          const startTime = this.startTime || '00:00'
          const startDateTime = new Date(startDate + 'T' + startTime)
          const endDate = this.endDate || '3000-01-01'
          const endTime = this.endTime || '00:00'
          const endDateTime = new Date(endDate + 'T' + endTime)

          const reservationsBetween = this.events.filter(e => {
            return (
              e.item_id == this.ciSelected.id &&
              e.id != this.id &&
              filters.testRangeOverlap(
                startDateTime.toISOString(),
                endDateTime.toISOString(),
                e.start_date,
                e.end_date,
                this.allDay
              )
            )
          })
          if (reservationsBetween.length > 0) {
            errors.endDate = ['Existing reservations between start/end date.']
            errors.startDate = ['Existing reservations between start/end date.']
          }
        }
      }
      if (this.ciSelectedStatus !== 'enabled' && !errors.ciSelected) {
        errors.ciSelected = ['Item invalid status']
      }
      return errors
    },
    isChanged() {
      //TODO: FIND WHY AFTER SAVING isChanged does not reset to false
      let isChanged = false
      Object.keys(this.originalValues).forEach(field => {
        if (this.originalValues[field] !== this[field]) {
          isChanged = true
        }
      })
      return isChanged
    },
    itemList() {
      let list = []
      for (let item of this.catalogItems) {
        let ci = { ...item }
        const category = filters.categoryById(ci.category, this.categories)
        ci.isDisabled = false
        ci.category = category && category.name ? category.name : 'unk'
        ci.image =
          ci.image_data.src ||
          'https://www.eipl.org/reservations/images/uploads/458d8cab268259a7e676eadc42ec2c6d.gif'
        if (ci.status !== 'enabled') {
          ci.isDisabled = true
        } else if (this.startDate && this.endDate) {
          this.events.forEach(event => {
            if (
              event.item_id === item.id &&
              this.id != event.id &&
              filters.testRangeOverlap(
                this.formattedStartDateTime(),
                this.formattedEndDateTime(),
                event.start_date,
                event.end_date,
                this.allDay
              )
            ) {
              ci.isDisabled = true
              ci.status = 'unavailable'
            }
          })

          // test available
        } else {
          ci.isDisabled = false
        }

        if (
          this.eventediting &&
          this.eventediting.ciData &&
          this.eventediting.ciData.id === ci.id &&
          this.eventediting.ciData.statue === 'enabled'
        ) {
          ci.isDisabled = false
          ci.status = 'enabled'
        }
        list.push(ci)
      }
      return list
    },
    patronList() {
      return this.patrons
    },
    reservationLengthWarn() {
      if (
        this.ciSelected?.reservation_length &&
        this.startDate &&
        this.endDate
      ) {
        const length = parseInt(this.ciSelected.reservation_length)
        const diff = formats.dateDifference(this.startDate, this.endDate)
        return diff > length
          ? `Reservation length of ${diff} days exceeds selected item's configured period of ${length} days.`
          : false
      }
      return false
    },
    saveDisabled() {
      return (
        !this.valid ||
        Object.keys(this.formErrors).length > 0 ||
        !this.isChanged
      )
    }
  },
  methods: {
    allowedStart(val) {
      let events = []
      const startDate = val || '1980-01-01'
      const startTime = this.startTime || '00:00'
      const startDateTime = new Date(startDate + 'T' + startTime)
      const endDate = this.endDate || '3000-01-01'
      const endTime = this.endTime || '00:00'
      const endDateTime = new Date(endDate + 'T' + endTime)
      if (this.ciSelected) {
        const ci = { ...this.ciSelected }
        events = this.events.filter(e => {
          if (e.item_id === ci.id) {
            return (
              !filters.testRangeOverlap(
                e.start_date,
                e.end_date,
                startDateTime,
                startDateTime,
                // this.allDay
                // ci.reservation_buffer
                1
              ) || e.id == this.id
            )
          } else {
            return true
          }
        })
        return (
          events.length >= this.events.length &&
          startDateTime.getTime() < endDateTime.getTime()
        )
      } else {
        return true
      }
    },
    allowedEnd(val) {
      let events = []
      const startDate = this.startDate || '1980-01-01'
      const startTime = this.startTime || '00:00'
      const startDateTime = new Date(startDate + 'T' + startTime)
      const endDate = val || '3000-01-01'
      const endTime = this.endTime || '00:00'
      const endDateTime = new Date(endDate + 'T' + endTime)
      if (this.ciSelected) {
        const ci = { ...this.ciSelected }
        events = this.events.filter(e => {
          if (e.item_id === ci.id) {
            return (
              !filters.testRangeOverlap(
                e.start_date,
                e.end_date,
                endDateTime.toISOString(),
                endDateTime.toISOString(),
                this.allDay
              ) || e.id == this.id
            )
          } else {
            return true
          }
        })
        return (
          events.length >= this.events.length &&
          endDateTime.getTime() > startDateTime.getTime()
        )
      } else {
        return true
      }
    },
    clearValue(val) {
      this[val] = null
    },
    customFilter(item, queryText) {
      const possibleKeys = [
        'abbreviation',
        'category',
        'name',
        'first_name',
        'last_name',
        'barcode'
      ]
      return filters.findStringMatchesInObj(item, possibleKeys, queryText)
    },
    dateMin() {
      const now = new Date()
      let month = now.getMonth() + 1
      let day = now.getDate()
      const year = now.getFullYear()
      if (day < 10) {
        day = '0' + day
      }
      if (month < 10) {
        month = '0' + month
      }
      return year + '-' + month + '-' + day
    },
    deleteEvent() {
      this.$store
        .dispatch('apiCall', {
          endpoint: '/reservation_delete/' + this.id
        })
        .then(resp => {
          if (resp.status === 'success') {
            this.$store.dispatch('setStateValue', {
              key: 'events',
              value: this.events.filter(e => e.id !== this.id)
            })
            this.$emit('close', { wasDeleted: true })
          }
        })
        .catch(err => console.log(err))
    },
    itemActionText(item) {
      return item.status == 'unavailable' && item.lastReservation['0']
        ? `${formats.timestampHuman(
            item.lastReservation['0'].start_date,
            false,
            false
          )} - ${formats.timestampHuman(
            item.lastReservation['0'].end_date,
            false,
            false
          )}`
        : item.status.toUpperCase()
    },
    formattedEvent() {
      const startTime = this.startTime ? ' ' + this.startTime : ' 00:00'
      const endTime = this.endTime ? ' ' + this.endTime : ' 00:00'
      let event = {
        item_id: this.ciSelected.id,
        patron_id: this.patronSelected.id,
        start_date: this.startDate + startTime,
        end_date: this.endDate + endTime,
        notes: this.notes
      }
      if (this.id) {
        event.id = this.id
      }
      return event
    },
    formattedEndDateTime() {
      const endDate = this.endDate || '1980-01-01'
      const endTime = this.endTime || '00:00'
      const endDateTime = new Date(endDate + ' ' + endTime)
      return endDateTime
    },
    formattedStartDateTime() {
      const startDate = this.startDate || '1980-01-01'
      const startTime = this.startTime || '00:00'
      const startDateTime = new Date(startDate + ' ' + startTime)
      return startDateTime
    },
    formatTimestamp(timestamp, withYear = true, withTime = false) {
      const local = new Date(timestamp + 'T00:00:00')
      return formats.timestampHuman(local, withYear, withTime)
    },
    humanTime(time) {
      if (time) {
        const timeArr = time.split(':')
        let hour = parseInt(timeArr['0'])
        let min = parseInt(timeArr['1'])
        let period = ' a.m.'
        if (hour === 0) {
          hour = 12
        } else {
          if (hour > 12) {
            hour = hour - 12
            period = ' p.m.'
          }
        }
        return `${hour.toString().padStart(2, '0')}:${min
          .toString()
          .padStart(2, '0')} ${period}`
      } else {
        return null
      }
    },
    modalAction() {
      const event = this.formattedEvent()
      if (Object.keys(this.formErrors).length < 1) {
        this.$store
          .dispatch('apiCall', {
            endpoint: '/reservation',
            postData: event
          })
          .then(resp => {
            if (resp.status === 'error') {
              //TODO SETUP ERROR HANDLING + FEEDBACK
            }
            if (resp.status === 'success') {
              if (!this.id) {
                this.id = resp.data
                event.id = resp.data
                this.$store.dispatch('setStateValue', {
                  isPush: true,
                  key: 'events',
                  value: { ...event }
                })
              } else {
                this.updateEvent(event)
              }
              this.$emit('eventUpdated')
              this.$emit('close')
            }
          })
          .catch(err => console.log(err))
      }
    },
    onAllDay(e) {
      if (e) {
        // this.startTime = '00:00'
        // this.endTime = '00:00'
      }
    },
    onPatronAdd(e) {
      this.patronSelected = e
      this.modalPatronEdit = false
    },
    setEventValue(e) {
      this.ciSelected = filters.customfieldById(e.item_id, this.itemList)
    },
    resetChanges() {
      Object.keys(this.originalValues).forEach(field => {
        this[field] = this.originalValues[field]
      })
    },
    updateEvent(event) {
      const events = [...this.events]
      const key = this.events.findIndex(e => e.id == this.id)
      events[key] = event
      this.$store.dispatch('setStateValue', {
        key: `events`,
        value: [...events]
      })
      this.$emit('eventUpdated', this.eventediting)
    }
  },
  mounted() {
    // if (this.eventediting && this.eventediting.id) {
    if (this.eventediting) {
      const event = { ...this.eventediting }
      const valPairs = {
        id: 'id',
        ciData: 'ciSelected',
        patronData: 'patronSelected',
        start_date: 'startDate',
        end_date: 'endDate',
        note: 'notes'
      }

      Object.keys(valPairs).forEach(k => {
        if (k == 'start_date' && event[k]) {
          const splitStart = event.start_date.split(' ')
          this.startDate = splitStart[0]
          this.startTime = splitStart[1] || null
          this.originalValues = {
            ...this.originalValues,
            startDate: this.startDate,
            startTime: this.startTime
          }
        } else if (k == 'end_date' && event[k]) {
          const splitEnd = event.end_date.split(' ')
          this.endDate = splitEnd[0]
          this.endTime = splitEnd[1] || null
          this.originalValues = {
            ...this.originalValues,
            endDate: this.endDate,
            endTime: this.endTime
          }
        } else {
          if (event[k] != undefined) {
            this[valPairs[k]] = event[k]
            this.$set(this.originalValues, valPairs[k], this[valPairs[k]])
          }
        }
      })
      const isAllDay =
        (this.startTime === '00:00' && this.endTime === '00:00') || !event.id
      this.originalValues = { ...this.originalValues, allDay: isAllDay }
      this.allDay = isAllDay
    }
  }
}
</script>

<style scoped>
.bounce-top-enter-active {
  -webkit-animation: bounce-top 0.9s both;
  animation: bounce-top 0.9s both;
}

.bounce-top-leave-active {
  animation: fadeOut ease 8s;
  -webkit-animation: fadeOut ease 8s;
  -moz-animation: fadeOut ease 8s;
  -o-animation: fadeOut ease 8s;
  -ms-animation: fadeOut ease 8s;
}

/* ----------------------------------------------
 * Generated by Animista on 2020-3-3 23:18:34
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * fade out
 * ----------------------------------------
 */

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-moz-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-o-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-ms-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/**
 * ----------------------------------------
 * animation bounce-top
 * ----------------------------------------
 */
@-webkit-keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}
@keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}
</style>
