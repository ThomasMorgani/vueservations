<template>
  <v-row fill-height align-start justify-start dense no-gutters>
    <v-col cols="12">
      <v-toolbar height="40" flat color="background">
        <!-- <v-btn outlined class="mr-4" @click="setToday">Today</v-btn> -->
        <v-menu bottom right>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" color="primary">
              <span class="title font-weight-bold">
                {{ typeToLabel[type] }}
              </span>
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn fab text small @click="prev">
          <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn fab text small @click="next">
          <v-icon small>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- <v-btn outlined color="primary" class="mr-4" @click="eventAdd">
          <v-icon left>mdi-bookmark-plus-outline</v-icon>NEW
        </v-btn>-->
        <v-menu
          v-model="menuHeightSlider"
          :close-on-content-click="false"
          :nudge-width="200"
          bottom
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon color="primary">mdi-arrow-split-horizontal</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="title primary--text"
              >Calendar Height</v-card-title
            >
            <v-card-text>
              <v-slider
                v-model="calendarMonthHeight"
                :color="color"
                track-color="grey"
                hide-details
                :min="styleCal.height || 800"
                max="3500"
              ></v-slider>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-btn icon @click="eventAdd">
          <v-icon color="primary">mdi-calendar-plus</v-icon>
        </v-btn>
        <filterBtn></filterBtn>
      </v-toolbar>
      <!-- </v-sheet> -->
    </v-col>
    <v-col cols="12">
      <!-- <v-sheet height="calc(100vh - 64px)" style="overflow-y: scroll;"> -->
      <v-sheet class="px-2" :style="styleCal">
        <v-sheet :height="type === 'month' ? calendarMonthHeight : '100%'">
          <!-- TOOL TIP ON MOUSE ENTER/LEAVE.. PROBABLY WILL REMOVE -->
          <!-- @mouseenter:event="showTooltip($event, true)" -->
          <!-- @mouseleave:event="showTooltip($event, false)"<v-calendar -->
          <v-calendar
            ref="calendar"
            v-model="focus"
            :key="modalDetailsShow"
            color="primary"
            :events="orderBy(eventsList, 'name')"
            :event-color="eventColor"
            :event-margin-bottom="2"
            :event-name="eventLabel"
            event-start="start_date"
            event-end="end_date"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            @contextmenu:day="contextDay"
          ></v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :close-on-click="!modalDetailsShow"
            :activator="selectedElement"
            max-width="350"
          >
            <eventMenu
              :event="selectedEvent"
              @closeDetails="selectedOpen = false"
              @deleteEvent="eventDelete"
              @editEvent="eventEdit"
              @showDetails="showDetails"
            ></eventMenu>
          </v-menu>
          <v-tooltip top v-model="tooltipEvent" v-bind="toptipPosition">
            <span>HELLO</span>
          </v-tooltip>
          <v-dialog
            v-model="modalDetailsShow"
            max-width="800px"
            transition="dialog-transition"
          >
            <component
              :key="modalDetailsShow + modalDetailsComp"
              :is="modalDetailsComp"
              :event="selectedEvent"
              @close="onDetailsClose($event)"
              @eventModalAction="onDetailsAction"
              @eventUpdated="calendarcheckChanges"
            ></component>
          </v-dialog>
        </v-sheet>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import filters from '@/modules/filters.js'
import * as formats from '@/modules/formats.js'
import { timestampHuman } from '@/modules/formats.js'
import eventMenu from '@/components/calendar/eventOverview'
import filterBtn from '@/components/global/buttons/filterDrawerToggle'

import Vue2Filters from 'vue2-filters'

export default {
  name: 'Calendar',
  components: {
    ciDetails: () => import('@/components/catalog/catalogItem/ciDetails'),
    eventEdit: () => import('@/components/calendar/eventEdit'),
    eventDetails: () => import('@/components/calendar/eventDetails'),
    eventMenu,
    filterBtn,
    patronDetails: () => import('@/components/patron/patronDetails')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    today: new Date().toISOString().substring(0, 10),
    focus: new Date().toISOString().substring(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    name: null,
    navDrawer: false,
    start: null,
    end: null,
    calendarMonthHeight: 2000,
    menuHeightSlider: false,
    modalDetailsComp: null,
    modalDetailsShow: false,
    color: '#000066',
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    tooltipEvent: false,
    toptipPosition: { 'position-x': 0, 'position-y': 0 }
  }),
  computed: {
    ...mapState({
      events: state => state.events,
      filterCategory: state => state.filterCategory,
      filterRangeDate: state => state.filterRangeDate,
      filterSearch: state => state.filterSearch,
      catalogItems: state => state.catalogItems,
      patrons: state => state.patrons
    }),
    ...mapGetters(['categoriesById']),
    eventsList() {
      let eventsFiltered = []
      let modalVis = this.modalDetailsShow
      console.log(modalVis)
      const filterNames = ['filterCategory', 'filterRangeDate', 'filterSearch']
      let filtersSet = {}
      filterNames.forEach(f =>
        this[f] && this[f].length > 0 ? (filtersSet[f] = this[f]) : null
      )
      if (Array.isArray(this.events)) {
        this.events.forEach(e => {
          eventsFiltered.push({
            ...e,
            ciData: filters.getObjectFromArray(
              this.catalogItems,
              'id',
              e.item_id
            ), //
            patronData: filters.getObjectFromArray(
              this.patrons,
              'id',
              e.patron_id
            )
          })
        })

        if (Object.keys(filtersSet).length > 0) {
          if (filtersSet.filterCategory) {
            eventsFiltered = eventsFiltered.filter(
              e => filtersSet.filterCategory.indexOf(e.ciData.category) > -1
            )
          }

          if (filtersSet.filterSearch) {
            const possibleKeysCi = ['abbreviation', 'name']
            const possibleKeysPatron = [
              'barcode',
              'email',
              'first_name',
              'last_name',
              'phone'
            ]
            eventsFiltered = eventsFiltered.filter(e => {
              return (
                filters.findStringMatchesInObj(
                  e.ciData,
                  possibleKeysCi,
                  filtersSet.filterSearch
                ) ||
                filters.findStringMatchesInObj(
                  e.patronData,
                  possibleKeysPatron,
                  filtersSet.filterSearch
                )
              )
            })
          }

          if (
            filtersSet.filterRangeDate &&
            filtersSet.filterRangeDate['0'] &&
            filtersSet.filterRangeDate['1']
          ) {
            eventsFiltered = eventsFiltered.filter(e =>
              filters.testRangeOverlap(
                filtersSet.filterRangeDate['0'],
                filtersSet.filterRangeDate['1'],
                e.start_date,
                e.end_date
              )
            )
          }
        }
      }
      return eventsFiltered
    },
    title() {
      const { start, end } = this
      if (!start || !end) {
        return 'Default Month'
      }
      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth
      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long'
      })
    },
    styleCal() {
      let height = this.$store.state.content.main.y || null
      if (height) {
        height = height - 160
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  },
  methods: {
    calendarcheckChanges() {
      this.$refs.calendar.checkChange()
      if (this.selectedOpen) {
        //TODO MOVE OVERVIEW MENU TO NEW EVENT START
      }
    },
    eventColor(e) {
      let item = filters.getObjectFromArray(this.catalogItems, 'id', e.item_id)
      return this.filterCategory.length === 1
        ? item.color
        : this.categoriesById[item.category].color
    },
    eventLabel(v) {
      let start = timestampHuman(v.input.start_date, false, false)
      let end = timestampHuman(v.input.end_date, false, false)
      let label = `
        <span id="${v.input.ciData.abbreviation}" class="mx-2 subtitle-2">
          <strong>${v.input.ciData.abbreviation}</strong>
          ${v.input.patronData.last_name} ${start} - ${end}
          <v-icon small color="white" v-text="${
            v.input.notes ? 'mdi-note' : ''
          }"></v-icon>
        </span>
      `

      return label
    },
    initializeApp() {
      //MOVE THIS TO APP.js
      console.log('get events method')
      this.axios
        .get(`${this.$apiSettings.baseUrl}/initialize_page_data`)
        .then(response => {
          console.log(response)
          if (response.data && response.data.reservations) {
            // response.data.reservations.forEach(res => this.events.push({...res, name: res.title, start: res.startDate, end: res.end_date}))
            this.events = response.data.reservations
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    eventAdd() {
      console.log('eventAdd')
      this.showDetails({ type: 'edit' })
    },
    eventDelete(eid) {
      //expects event id
      console.log(eid)
    },
    eventEdit(e) {
      console.log(this.$refs)
      if (e) {
        this.$store.dispatch('setStateValue', {
          key: 'eventediting',
          value: e
        })
        this.modalDetailsComp = 'eventEdit'
        setTimeout(() => (this.modalDetailsShow = true), 19)
        console.log('event found open modal')
      } else {
        console.log('error: event not found')
      }
    },
    contextDay(e) {
      //right click day
      console.log(e)
    },
    formatEventPreview(e) {
      //TODO: move to module
      //this will format each reservation until we do so in backend
      console.log(e)
      let test = formats.dateDifference(e.start_date, e.end_date)
      console.log(test)
      const data = {
        details: {
          color: this.eventColor(e),
          id: e.id,
          title: e.ciData.name || 'Event Details'
        },
        eventData: e,
        fields: {
          First: e.patronData.first_name || '',
          Last: e.patronData.last_name || '-',
          Start: e.start_date || '-',
          End: e.end_date || '-',
          Length: formats.dateDifference(e.start_date, e.end_date) + ' Days',
          Note: e.notes && Array.isArray(e.notes) ? e.notes[0] : e.notes
        }
      }
      return data
    },
    getEventById(eid) {
      const eventKey = this.events.findIndex(event => event.id === eid)
      return eventKey > -1 ? this.events[eventKey] : null
    },
    getEventKeyById(eid) {
      return this.events.findIndex(event => event.id === eid)
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    onDetailsAction(a) {
      console.log(a)
    },
    onDetailsClose(e) {
      this.modalDetailsShow = false
      this.$store.dispatch('setStateValue', {
        key: 'eventediting',
        value: null
      })
      if (e && e.wasDeleted) {
        this.selectedOpen = false
      }
    },
    showDetails(e) {
      console.log(e)
      switch (e.type) {
        case 'ci':
          this.modalDetailsComp = 'ciDetails'
          break
        case 'edit':
          console.log('is vent')
          this.modalDetailsComp = 'eventEdit'
          break
        case 'event':
          console.log('is vent')
          this.modalDetailsComp = 'eventDetails'
          break
        case 'patron':
          this.modalDetailsComp = 'patronDetails'
          break
        default:
          console.log('err: no match')
          this.modalDetailsComp = null
          //TODO: maybe set no match for generic error
          break
      }
      if (this.modalDetailsComp) {
        setTimeout(() => (this.modalDetailsShow = true), 19)
      }
    },
    showEvent({ nativeEvent, event }) {
      console.log('show')
      const open = () => {
        this.selectedEvent = this.formatEventPreview(event)
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        if (this.selectedElement !== nativeEvent.target) {
          setTimeout(open, 10)
        }
      } else {
        open()
      }
      nativeEvent.stopPropagation()
    },
    // showTooltip({nativeEvent}, show) {
    //   let adjX = nativeEvent.screenX + 50
    //   let adjY = nativeEvent.screenY - 120
    //   this.toptipPosition = {'position-x': adjX,  'position-y': adjY}
    //   this.tooltipEvent = show

    // },
    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start
      this.end = end
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    }
  },
  mounted() {
    // this.initializeApp()
    // this.$vuetify.theme.isDark = true
    // console.log(this.$vuetify)
  }
}
</script>

<style></style>
