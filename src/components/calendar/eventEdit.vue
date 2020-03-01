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
              outlined
              clearable
              prepend-icon="mdi-format-list-bulleted-type"
              return-object
              :filter="customFilter"
              :error-messages="formErrors.ciSelected"
            >
              <template v-slot:selection="data">
                <v-list-item>
                  <v-list-item-avatar size="45">
                    <img :src="data.item.image" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="data.item.name" class="font-weight-bold"></v-list-item-title>
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
              <template v-slot:item="data">
                <v-list-item-avatar size="45">
                  <img :src="data.item.image" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="data.item.name" class="font-weight-bold"></v-list-item-title>
                  <v-list-item-subtitle
                    :class="
                      data.item.isDisabled ? 'text--disabled' : 'text--primary'
                    "
                    v-text="`${data.item.abbreviation}: ${data.item.category}`"
                  ></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
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
                    <v-list-item-subtitle class="text--primary" v-text="data.item.barcode"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="`${data.item.last_name}, ${data.item.first_name}`"
                    class="font-weight-bold"
                  ></v-list-item-title>
                  <v-list-item-subtitle class="text--primary" v-text="data.item.barcode"></v-list-item-subtitle>
                </v-list-item-content>
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
                  v-model="startDate"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  :error-messages="formErrors.startDate"
                ></v-text-field>
              </template>
              <v-date-picker v-model="startDate" scrollable :allowed-dates="allowedStart">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalStartDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.startDateDialog.save(startDate)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
          <v-col cols="5">
            <v-dialog
              ref="startTimeDialog"
              v-model="modalStartTime"
              :return-value.sync="startTime"
              persistent
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startTime"
                  label="Start Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-on="on"
                  disabled
                ></v-text-field>
              </template>
              <v-time-picker v-if="modalStartTime" v-model="startTime">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalStartTime = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.startTimeDialog.save(startTime)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </v-col>
          <v-col cols="5">
            <!--
              END DATE ++ TIME
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
                  v-model="endDate"
                  label="End Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-on="on"
                  :rules="endDateRules"
                  :error-messages="formErrors.endDate"
                ></v-text-field>
              </template>
              <v-date-picker v-model="endDate" scrollable :allowed-dates="allowedEnd">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalEndDate = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.modalEndDateDialog.save(endDate)">OK</v-btn>
              </v-date-picker>
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
                  v-model="endTime"
                  label="End Time"
                  prepend-icon="mdi-clock"
                  readonly
                  v-on="on"
                  disabled
                ></v-text-field>
              </template>
              <v-time-picker v-if="modalEndTime" v-model="endTime" full-width>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="modalEndTime = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.dialog.save(endTime)">OK</v-btn>
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
      >DELETE</v-btn>
      <v-btn color="warning darken-1" text :disabled="!isChanged" @click="resetChanges">RESET</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="$emit('close')">CANCEL</v-btn>
      <v-btn
        color="success"
        text
        v-text="id ? 'SAVE' : 'SUBMIT'"
        @click.native="modalAction('submit')"
        :disabled="!valid || Object.keys(formErrors).length > 0 || !isChanged"
      ></v-btn>
    </v-card-actions>
    <v-dialog v-model="modalPatronEdit" transition="dialog-transition" max-width="800">
      <patronEdit
        :key="modalPatronEdit"
        @close="modalPatronEdit = false"
        @patronAdded="onPatronAdd"
      ></patronEdit>
    </v-dialog>
    <v-dialog v-model="modalConfirmDelete" max-width="500px" transition="dialog-transition">
      <!--TODO: Move to Component -->
      <v-card v-if="modalConfirmDelete">
        <v-card-title class="justify-center title error--text">CONFIRM DELETE</v-card-title>
        <v-card-text>
          <v-row class="justify-center align-center">
            <v-col cols="12" class="align-center">
              <p
                class="font-weight-bold text-center mb-0"
              >WARNING: You are about to delete reservation:</p>
              <p v-if="isChanged" class="text-center caption">(original reservation details below)</p>
              <p class="title font-weight-bold text-center mt-4">{{originalValues.ciSelected.name}}</p>
              <p
                class="font-weight-bold text-center"
              >{{`${originalValues.patronSelected.last_name}, ${originalValues.patronSelected.first_name}`}}</p>
              <p
                class="font-weight-bold text-center"
              >{{`${originalValues.startDate} - ${originalValues.endDate}`}}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn color="primary" text @click="modalConfirmDelete = !modalConfirmDelete">CANCEL</v-btn>
          <v-btn color="error" text @click="deleteEvent">DELETE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters'
import Vue2Filters from 'vue2-filters'
export default {
  name: 'eventEdit',
  components: {
    // ciListMenu: () => import('@/components/global/listTiles')
    patronEdit: () => import('@/components/patron/patronDetails')
  },
  props: [],
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      ciSelected: null,
      endDate: null,
      endTime: null,
      id: null,
      modalConfirmDelete: false,
      modalPatronEdit: false,
      patronSelected: null,
      startDate: null,
      startTime: null,
      statusData: {
        blocked: {
          icon: 'mdi-phone-cancel',
          color: 'error'
        },
        disabled: {
          icon: 'mdi-phone-cancel',
          color: 'error'
        },
        enabled: {
          icon: 'mdi-check-circle',
          color: 'success'
        },
        unavailable: {
          icon: 'mdi-calendar-alert',
          color: 'warning'
        }
      },
      modalEndDate: false,
      modalEndTime: false,
      modalStartDate: false,
      modalStartTime: false,
      notes: '',
      originalValues: {
        ciSelected: null,
        id: null,
        endDate: null,
        endTime: null,
        patronSelected: null,
        startDate: null,
        startTime: null,
        notes: ''
      },
      endDateRules: [
        v =>
          new Date(v) >= new Date(this.startDate) ||
          'END DATE MUST BE AFTER START DATE'
      ],
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
      patrons: state => state.patrons
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
      let end = new Date(this.endDate)
      let start = new Date(this.startDate)
      if (end < start) {
        errors.endDate = ['End date must come after start.']
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
              filters.testRangeOverlap(
                this.startDate,
                this.endDate,
                event.start_date,
                event.end_date
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
          this.eventediting.ciData.id === ci.id
        ) {
          ci.isDisabled = false
          ci.status = 'enabled'
        }
        list.push(ci)
      }
      return list
    },
    patronList() {
      //TODO: add fillters
      return this.patrons
    },
    ciSelectedStatus() {
      if (!this.ciSelected) {
        return null
      } else {
        const id = this.ciSelected.id
        const item = filters.customfieldById(id, this.itemList)

        return item.status
      }
    }
  },
  methods: {
    allowedStart(val) {
      let events = []
      if (this.ciSelected) {
        const ci = { ...this.ciSelected }
        events = this.events.filter(e => {
          if (e.item_id === ci.id) {
            return !filters.testRangeOverlap(e.start_date, e.end_date, val, val)
          } else {
            return true
          }
        })
        return events.length >= this.events.length
      } else {
        return true
      }
    },
    allowedEnd(val) {
      let cDate = new Date(val)
      let startDate = new Date(this.startDate)
      return cDate > startDate
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
      //console.log(year + '-' + month + '-' + day)
      return year + '-' + month + '-' + day
    },
    deleteEvent() {
      console.log('deleteEvent')
      this.$store
        .dispatch('apiCall', {
          endpoint: '/reservation_delete/' + this.id
        })
        .then(resp => {
          console.log(resp)
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
    formattedEvent() {
      this.startTime = this.startTime ? this.startTime : '00:00:00'
      this.endTime = this.endTime ? this.endTime : '00:00:00'
      let event = {
        item_id: this.ciSelected.id,
        patron_id: this.patronSelected.id,
        start_date: this.startDate + ' ' + this.startTime,
        end_date: this.endDate + ' ' + this.endTime,
        notes: this.notes
      }
      if (this.id) {
        event.id = this.id
      }
      return event
    },
    modalAction(action) {
      const event = this.formattedEvent()
      console.log(event)
      if (action === 'submit') {
        if (Object.keys(this.formErrors).length < 1) {
          // this.$emit('eventModalAction', {
          //   action: action,
          //   data: this.formattedEvent()
          // })
          this.$store
            .dispatch('apiCall', {
              endpoint: '/reservation',
              postData: event
            })
            .then(resp => {
              if (resp.status === 'error') {
                console.log('eventEditResp ERROR', resp)
                //TODO SETUP ERROR HANDLING + FEEDBACK
              }
              if (resp.status === 'success') {
                this.id = resp.data
                this.$store.dispatch('setStateValue', {
                  isPush: true,
                  key: 'events',
                  value: { ...event, id: resp.data }
                })
                this.$emit('close')
              }
            })
            .catch(err => console.log(err))
        }
        // if (this.$refs.form.validate()) {
        //   data['startDate'] = this.startDate
        //   data['endDate'] = this.endDate
        //   data['nameFirst'] = this.nameFirst
        //   data['nameLast'] = this.nameLast
        //   data['barcode'] = this.barcode
        //   data['notes'] = this.notes
        //   data['device'] = this.device
        // }
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
    }
  },
  mounted() {
    // console.log('mounted')
    if (this.eventediting) {
      const event = this.eventediting

      console.log('ciEditing:', event)
      const valPairs = {
        id: 'id',
        ciData: 'ciSelected',
        patronData: 'patronSelected',
        start_date: 'startDate',
        end_date: 'endDate',
        note: 'notes'
      }

      Object.keys(valPairs).forEach(k => {
        if (k == 'start_date') {
          const splitStart = event.start_date.split(' ')
          console.log(splitStart)
          this.startDate = splitStart[0]
          this.startTime = splitStart[1] || '00:00:00'
          this.$set(this.originalValues, 'startDate', this.startDate)
          this.$set(this.originalValues, 'startTime', this.startTime)
        } else if (k == 'end_date') {
          const splitEnd = event.end_date.split(' ')
          this.endDate = splitEnd[0]
          this.endTime = splitEnd[1] || '00:00:00'
          this.$set(this.originalValues, 'endDate', this.endDate)
          this.$set(this.originalValues, 'endTime', this.endTime)
        } else {
          if (event[k] != undefined) {
            this[valPairs[k]] = event[k]
            this.$set(this.originalValues, valPairs[k], this[valPairs[k]])
          }
        }
      })
    }
  }
}
</script>

<style scoped></style>
