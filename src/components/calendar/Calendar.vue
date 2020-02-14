<template>
  <v-row fill-height align-start justify-start dense no-gutters>
    <v-col cols="12">
      <!-- <v-sheet height="10vh"> -->
      <v-toolbar height="40" flat color="background">
        <!-- <v-btn outlined class="mr-4" @click="setToday">Today</v-btn> -->
        <v-menu bottom right>
          <template v-slot:activator="{ on }">
            <v-btn text v-on="on" color="primary">
              <span class="title font-weight-bold">
                {{
                typeToLabel[type]
                }}
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
        <v-btn icon @click="eventAdd">
          <v-icon color="primary">mdi-calendar-plus</v-icon>
        </v-btn>
        <v-btn icon @click="navDrawer = !navDrawer">
          <v-icon color="primary">
            {{
            navDrawer ? 'mdi-filter-remove' : 'mdi-filter'
            }}
          </v-icon>
        </v-btn>
      </v-toolbar>
      <!-- </v-sheet> -->
    </v-col>
    <v-col cols="12">
      <FilterDrawer :value="navDrawer"></FilterDrawer>

      <!-- <v-sheet height="calc(100vh - 64px)" style="overflow-y: scroll;"> -->
      <v-sheet class="px-2" :style="styleCal">
        <v-sheet :height="type === 'month' ? calendarMonthHeight : '100%'">
          <!-- TOOL TIP ON MOUSE ENTER/LEAVE.. PROBABLY WILL REMOVE -->
          <!-- @mouseenter:event="showTooltip($event, true)" -->
          <!-- @mouseleave:event="showTooltip($event, false)"<v-calendar -->
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="eventsList"
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
            :activator="selectedElement"
            max-width="350"
          >
            <eventDetailsCard
              :event="selectedEvent"
              @closeDetails="selectedOpen = false"
              @deleteEvent="eventDelete"
              @editEvent="eventEdit"
            ></eventDetailsCard>
          </v-menu>
          <v-tooltip top v-model="tooltipEvent" v-bind="toptipPosition">
            <span>HELLO</span>
          </v-tooltip>
        </v-sheet>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters.js'
import { timestampHuman } from '@/modules/formats.js'
import eventDetailsCard from '@/components/calendar/eventDetailCard'
import FilterDrawer from '@/components/filterDrawer/FilterDrawer'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'Calendar',
  components: {
    eventDetailsCard,
    FilterDrawer
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
    details: null,
    navDrawer: false,
    start: null,
    end: null,
    calendarMonthHeight: 2000,
    color: '#000066',
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false,
    tooltipEvent: false,
    toptipPosition: {'position-x': 0, 'position-y': 0}
  }),
  computed: {
    ...mapState({
      filter: state => state.filter,
      events: state => state.events,
      catalogItems: state => state.catalogItems
    }),
    eventsList() {
      return this.events
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
    eventColor(e) {
      let item = filters.getObjectFromArray(this.catalogItems, 'id', e.item_id)
      return item.color
    },
    eventLabel(v) {
      let start = timestampHuman(v.input.start_date, false, false)
      let end = timestampHuman(v.input.end_date, false, false)
      let label = `<span class="mx-2 subtitle-2"><strong>${v.input.device}</strong>  ${v.input.patron_last} ${start} - ${end}</span>`

      return label
    },
    initializeApp() {
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
    },
    eventDelete(eid) {
      //expects event id
      console.log(eid)
    },
    eventEdit(eid) {
      //expects event id
      let event = this.getEventById(eid)
      if (event) {
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
      //this will format each reservation until we do so in backend
        console.log(e)
      const data = {
        item: filters.getObjectFromArray(this.catalogItems, 'id', e.item_id),
        details: {
          'color': this.eventColor(e)
        },
        fields: {
          'First': e.patron_first || '',
          'Last': e.patron_last || '-',
          'Start': e.start_date || '-',
          'End': e.end_date || '-',
          'Length': 'TBD?',
          'Note': e.notes[0] || null
        }
      }
      data.details.title = data.item.name || 'Event Details'
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
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = this.formatEventPreview(event)
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      console.log(this.selectedEvent)
      console.log(this.selectedElement)
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
  }
}
</script>

<style></style>
