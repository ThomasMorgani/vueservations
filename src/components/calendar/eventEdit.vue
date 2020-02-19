<template>
  <v-card>
    <v-card-title primary-title class="headline primary--text justify-center">ADD NEW RESERVATION</v-card-title>
    <v-card-text style="max-width: 1000px; max-height: 600px;">
      <v-form ref="form" v-model="valid">
        <v-row align="center" justify="center">
          <v-col cols="8" class="text-xs-center pt-4">
            <v-autocomplete
              v-model="ciSelected"
              :items="orderBy(itemList, 'name', 1)"
              label="Catalog Item"
              item-text="name"
              item-value="name"
              item-disabled="isDisabled"
              clearable
              return-object
              :filter="customFilter"
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
                      v-text="statusData[data.item.status].icon"
                      :color="statusData[data.item.status].color"
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
                    class="text--primary"
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
          <v-col cols="5">
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
            <v-text-field
              label="Patron"
              prepend-icon="mdi-account"
              v-model="nameFirst"
              class="mt-3"
            ></v-text-field>
          </v-col>
          <v-col cols="7">
            <v-textarea label="Notes" prepend-icon="mdi-note" rows="1" v-model="notes" class="mt-3"></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="$emit('close')">CANCEL</v-btn>
      <v-btn
        color="primary"
        text
        @click.native="modalAction('submit')"
        :disabled="!valid || device === ''"
      >SUBMIT</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters'
import Vue2Filters from 'vue2-filters'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
export default {
  name: 'eventEdit',
  components: {
    // ciListMenu: () => import('@/components/global/listTiles')
  },
  props: [],
  mixins: [Vue2Filters.mixin],
  data() {
    return {
      ciSelected: null,
      endDate: null,
      endTime: null,
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
      nameFirst: '',
      nameLast: '',
      barcode: '',
      notes: '',
      device: '',
      searchAvailability: {},
      barcodeInputRules: [
        v => !!v || 'BARCODE MANDATORY',
        v => v > 0 || 'BARCODE MANDATORY',
        v => !Number.isInteger(v) || 'NUMBERS ONLY NO SPACES'
      ],
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
      eventEditting: state => state.eventEditting,
      filter: state => state.filter
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
      let end = new Date(this.endDate)
      let start = new Date(this.startDate)
      if (end < start) {
        errors.endDate = ['End date must come after start.']
      }
      return errors
    },
    itemList() {
      let list = []
      for (let item of this.catalogItems) {
        let ci = { ...item }
        const category = filters.categoryById(ci.category, this.categories)
        // console.log(ci)
        // console.log(category)
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
              this.testRangeOverlap(
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
        list.push(ci)
      }
      return list
    }
  },
  methods: {
    allowedStart(val) {
      let events = []
      if (this.ciSelected) {
        const ci = { ...this.ciSelected }
        events = this.events.filter(e => {
          if (e.item_id === ci.id) {
            return !this.testRangeOverlap(e.start_date, e.end_date, val, val)
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
      const name = item.name.toLowerCase()
      const category = item.name.toLowerCase() //TODO: FIX TO CAT
      const abbreviation = item.abbreviation.toLowerCase()

      return (
        name.indexOf(queryText.toLowerCase()) > -1 ||
        abbreviation.indexOf(queryText.toLowerCase()) > -1 ||
        category.indexOf(queryText.toLowerCase()) > -1
      )
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
    modalAction(action) {
      let data = []
      data['action'] = action
      if (action === 'submit') {
        if (this.$refs.form.validate()) {
          data['startDate'] = this.startDate
          data['endDate'] = this.endDate
          data['nameFirst'] = this.nameFirst
          data['nameLast'] = this.nameLast
          data['barcode'] = this.barcode
          data['notes'] = this.notes
          data['device'] = this.device
        }
      }
      this.$emit('addEventModalAction', data)
    },
    setAvailableDevicesList() {
      this.availableDeviceList = []
      let disabledDevice = {}
      if (this.startDate && this.endDate) {
        for (let device in this.devices) {
          if (
            this.devices[device]['status'] === 'blocked' ||
            this.devices[device]['status'] === 'disabled'
          ) {
            disabledDevice = {}
            disabledDevice['text'] =
              'Hot Spot' +
              this.devices[device]['id'] +
              ' (' +
              this.devices[device]['status'].toUpperCase() +
              ')'
            disabledDevice['value'] = this.devices[device]['device']
            disabledDevice['disabled'] = true
            this.availableDeviceList.push(disabledDevice)
          } else {
            this.availableDeviceList.push({
              text: 'Hot Spot' + this.devices[device]['id'],
              value: this.devices[device]['device']
            })
          }
        }
        let searchStartDate = new Date(this.startDate)
        let searchEndDate = new Date(this.endDate)
        searchStartDate.setDate(searchStartDate.getDate() - 1)
        searchEndDate.setDate(searchEndDate.getDate() + 2)
        let eventRange = ''
        let searchRange = ''
        let eventStartDate = ''
        let eventEndDate = ''
        searchRange = moment.range(searchStartDate, searchEndDate)
        // for (let device in this.devices) {
        //   this.searchAvailability[device] = {}
        //   this.searchAvailability[device]['available'] = true
        // }
        for (let event in this.events) {
          eventStartDate = new Date(this.events[event]['startDate'])
          eventEndDate = new Date(this.events[event]['endDate'])
          eventRange = moment.range(eventStartDate, eventEndDate)
          if (eventRange.overlaps(searchRange, { adjacent: true })) {
            for (let item in this.availableDeviceList) {
              // this.availableDeviceList[item]['disabled'] = ''
              // console.log(this.availableDeviceList[item]['disabled'])
              if (
                this.events[event]['device'] ===
                this.availableDeviceList[item]['value']
              ) {
                if (!this.availableDeviceList[item]['disabled']) {
                  this.$set(
                    this.availableDeviceList[item],
                    'text',
                    this.availableDeviceList[item]['text'] + ' (NOT AVAILABLE)'
                  )
                  this.$set(this.availableDeviceList[item], 'disabled', true)
                }
                this.$set(this.availableDeviceList[item], 'disabled', true)
                if (this.device === this.availableDeviceList[item]['value']) {
                  this.device = ''
                }
              } else {
                // this.$set(this.availableDeviceList[item], 'text',  this.availableDeviceList[item]['text'])
                // this.$set(this.availableDeviceList[item], 'disabled',  false)
              }
            }
          }
        }
      }
    },
    testRangeOverlap(startDate1, endDate1, startDate2, endDate2) {
      let searchStartDate1 = new Date(startDate1)
      let searchEndDate1 = new Date(endDate1)
      //THIS IS FOR CUSTOM BUFFER PERIODS
      //TODO: make this a setting
      searchStartDate1.setDate(searchStartDate1.getDate() - 1)
      searchEndDate1.setDate(searchEndDate1.getDate() + 2)
      const searchRange1 = moment.range(searchStartDate1, searchEndDate1)

      const searchStartDate2 = new Date(startDate2)
      const searchEndtDate2 = new Date(endDate2)
      const searchRange2 = moment.range(searchStartDate2, searchEndtDate2)

      return searchRange1.overlaps(searchRange2, { adjacent: true })
    }
  },
  mounted() {
    // console.log('mounted')
    if (this.eventEditting) {
      console.log('ci editting:', this.eventEditting)
    }
  },
  created() {
    //
  },
  watch: {
    addReservationModalVisible() {
      if (this.addReservationModalVisible) {
        for (var device in this.devices) {
          // console.log(device)
          this.availableDeviceList.push({
            text: 'Hot Spot' + this.devices[device]['id'],
            value: this.devices[device]['device']
          })
        }
        if (this.selectedDevice) {
          // console.log('selectedDevice')
          this.device = this.selectedDevice
        }
        if (this.newEventStartDate) {
          // console.log('newEventStartDate')
          this.startDate = this.newEventStartDate
        }
        if (this.newEventEndDate) {
          // console.log('newEventEndDate')
          this.endDate = this.newEventEndDate
        }
      }

      if (!this.addReservationModalVisible) {
        this.availableDeviceList = []
        this.device = ''
        this.startDate = ''
        this.endDate = ''
        this.nameFirst = ''
        this.nameLast = ''
        this.barcode = ''
        this.notes = ''
        this.device = ''
      }
    },
    startDate() {
      if (this.startDate && !this.endDate) {
        let startdate = new Date(this.startDate)
        let endDate = startdate
        // console.log(startdate)
        // console.log(endDate)
        endDate.setDate(endDate.getDate() + 14)
        // console.log(startdate)
        // console.log(startdate.getDate())
        // console.log(startdate.getDate()+14)
        // console.log(endDate)
        let endY = endDate.getFullYear()
        let endM = endDate.getMonth() + 1
        if (endM < 10) {
          endM = '0' + endM
        }
        let endD = endDate.getDate()
        this.endDate = endY + '-' + endM + '-' + endD
      }
      if (this.startDate && this.endDate) {
        this.setAvailableDevicesList()
      }
    },
    endDate() {
      // console.log('end')
      if (this.startDate && this.endDate) {
        this.setAvailableDevicesList()
      }
    }
  }
}
</script>

<style scoped></style>
