<template>
  <v-row fill-height align-start justify-start dense no-gutters>
    <v-col cols="12">
      <v-toolbar height="40" flat color="background" class="primary--text">
        <!-- <btn-with-tooltip
          :btnProps="{ small: true }"
          :iconProps="{ icon: 'mdi-calendar-star' }"
          :tooltipProps="{ bottom: true }"
          tooltipText="Focus today"
          @click="setToday"
        ></btn-with-tooltip> -->

        <v-menu bottom>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip color="primary" bottom>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon v-on="{ ...tooltip, ...menu }">
                  <v-icon color="primary">
                    {{ calendarViewTypes[calendarView].icon }}
                  </v-icon>
                </v-btn>
              </template>
              <span>Period view</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="viewItem in Object.values(calendarViewTypes)"
              :key="viewItem.value"
              @click="setCalendarView(viewItem.value)"
            >
              <v-tooltip :color="viewItem.disabled ? '' : 'primary'" right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    :color="
                      viewItem.value === calendarView ? 'primary' : 'disabled'
                    "
                    v-on="on"
                    >{{ viewItem.icon }}</v-icon
                  >
                </template>
                <span>{{ viewItem.text }}</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn color="primary" fab small text @click="prev">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-toolbar-title>
          <v-menu
            ref="datePickerMenu"
            v-model="datePickerShow"
            :close-on-content-click="true"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-sheet
                v-bind="attrs"
                v-on="on"
                class="title primary--text font-weight-bold"
              >
                {{ title }}
              </v-sheet>
            </template>
            <v-date-picker
              :value="calendarFocus"
              @input="calendarFocus = $event + '-01'"
              type="month"
              no-title
              scrollable
            >
              <!-- <v-btn text color="warning" @click="datePickerShow = false">
                CLOSE
              </v-btn>
              <v-spacer></v-spacer> -->
              <v-btn text color="primary" @click.stop="focusToday">
                TODAY
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="success"
                @click="$refs.datePickerMenu.save(calendarFocus)"
              >
                CLOSE
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-toolbar-title>
        <v-btn fab color="primary" small text @click="next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <btn-with-tooltip
          :btnProps="{ color: layoutView === 'list' ? 'primary' : 'grey' }"
          :iconProps="{
            icon: 'mdi-format-list-text'
          }"
          :tooltipProps="{ bottom: true }"
          tooltipText="List view"
          @click="setLayoutView"
        ></btn-with-tooltip>

        <v-menu
          v-model="menuHeightSlider"
          :close-on-content-click="false"
          bottom
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-sheet v-on="on" color="transparent">
              <btn-with-tooltip
                :iconProps="{ icon: 'mdi-arrow-split-horizontal' }"
                :tooltipProps="{ bottom: true }"
                tooltipText="Calendar height"
              ></btn-with-tooltip>
            </v-sheet>
          </template>

          <v-card>
            <!-- <v-card-title class="title primary--text"
              >Calendar Height</v-card-title
            > -->
            <v-card-text>
              <v-slider
                v-model="calendarMonthHeight"
                :color="color"
                hide-details
                max="3500"
                :min="styleCal.height || 800"
                track-color="grey"
                vertical
                @input="onHeightChange"
              ></v-slider>
            </v-card-text>
          </v-card>
        </v-menu>

        <btn-with-tooltip
          :iconProps="{ icon: 'mdi-calendar-plus' }"
          :tooltipProps="{ bottom: true }"
          tooltipText="Add new event"
          @click="eventAdd"
        ></btn-with-tooltip>

        <filterBtn v-if="!filterDrawer"></filterBtn>
      </v-toolbar>
      <!-- </v-sheet> -->
    </v-col>
    <v-col cols="12">
      <!-- <v-sheet height="calc(100vh - 64px)" style="overflow-y: scroll;"> -->
      <v-sheet class="px-2" :style="styleCal">
        <v-sheet
          :height="calendarView === 'month' ? calendarMonthHeight : '100%'"
        >
          <!-- TOOL TIP ON MOUSE ENTER/LEAVE.. PROBABLY WILL REMOVE -->
          <!-- @mouseenter:event="showTooltip($event, true)" -->
          <!-- @mouseleave:event="showTooltip($event, false)"<v-calendar -->
          <!-- v-show="isLoaded && calendarView === 'month'" -->
          <v-calendar
            v-show="isLoaded"
            ref="calendar"
            v-model="calendarFocus"
            :key="modalDetailsShow"
            color="primary"
            :events="orderBy(eventsList, 'name')"
            :event-margin-bottom="2"
            event-end="end_date"
            event-overlap-mode="column"
            event-start="start_date"
            :now="today"
            :type="calendarView"
            @click:date="viewDay"
            @click:event="showEventMenu"
            @click:more="showEventsModal"
            @change="updateRange"
            @contextmenu:day="contextDay"
          >
            <!-- @click:more="viewDay"
            @click:date="viewDay" -->
            <!-- <template v-slot:day-body="{ time }">
              {{ time }}
              THIS IS DAY VIEW
            </template> -->
            <template #event="{event}">
              <v-sheet
                :color="eventColor(event)"
                class="d-flex align-center white--text"
              >
                <span v-html="eventLabel(event)"></span>
                <v-icon v-if="event.notes" small color="white"
                  >mdi-note-outline</v-icon
                >
              </v-sheet>
            </template>
          </v-calendar>
          <!-- :activator="selectedElement" -->
          <v-dialog
            v-model="selectedOpen"
            :close-on-content-click="false"
            :close-on-click="!modalDetailsShow"
            max-width="350"
            hide-overlay
          >
            <eventMenu
              :event="selectedEvent"
              @closeDetails="selectedOpen = false"
              @editEvent="eventEdit"
              @showDetails="showDetails"
            ></eventMenu>
          </v-dialog>
          <v-dialog v-model="modalDetailsShow" v-bind="modalDetailsProps">
            <component
              :key="modalDetailsShow + modalDetailsComp"
              :is="modalDetailsComp"
              :event="selectedEvent"
              v-bind="modalDetailsCompData"
              @close="onDetailsClose($event)"
              @eventModalAction="onDetailsAction"
              @eventUpdated="calendarCheckChanges"
            ></component>
          </v-dialog>
          <v-dialog
            :value="modalImageFullPreview"
            transition="dialog-transition"
            :key="
              `imgPrev${String(
                imagePreviewData && imagePreviewData.id
                  ? imagePreviewData.id
                  : 'none'
              )}`
            "
            @input="$store.dispatch('toggleModalImageFullPreview')"
          >
            <imagePreviewModal></imagePreviewModal>
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
import { timeHuman, timestampHuman } from '@/modules/formats.js'
import eventMenu from '@/components/calendar/eventOverview'
import filterBtn from '@/components/global/buttons/btnFilterDrawerToggle'

import Vue2Filters from 'vue2-filters'

export default {
  name: 'Calendar',
  components: {
    ciDetails: () => import('@/components/catalog/catalogItem/ciDetails'),
    eventEdit: () => import('@/components/calendar/eventEdit'),
    eventDetails: () => import('@/components/calendar/eventDetails'),
    eventMenu,
    filterBtn,
    imagePreviewModal: () => import('@/components/images/imagePreviewModal'),
    patronDetails: () => import('@/components/patron/patronDetails')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    calendarMonthHeight: 700,
    calendarFocus: null,
    calendarView: 'month',
    calendarViewTypes: {
      day: {
        icon: 'mdi-calendar-today',
        text: 'Day',
        value: 'day'
      },
      month: {
        icon: 'mdi-calendar-month',
        text: 'Month',
        value: 'month'
      },
      week: {
        icon: 'mdi-calendar-week',
        text: 'Week',
        value: 'week'
      }
      // 4day: {
      //   icon: '',
      //   text: '4 Day',
      //   value: '4day'
      // },
    },
    color: '#000066',
    currentlyEditing: null,
    datePickerShow: false,
    dialog: false,
    end: null,
    isLoaded: false,
    layoutView: 'calendar',
    // layoutViewTypes: {
    //   calendar: {
    //     icon: 'mdi-calendar-today',
    //     text: 'Calendar',
    //     value: 'calendar'
    //   },
    //   month: {
    //     icon: 'mdi-calendar-month',
    //     text: 'List',
    //     value: 'list'
    //   },
    // },

    menuHeightSlider: false,
    modalDetailsProps: {
      'max-width': '800',
      persistent: true,
      transition: 'dialog-transition',
      width: 'unset'
    },
    modalDetailsComp: null,
    modalDetailsCompData: null,
    modalDetailsShow: false,
    name: null,
    navDrawer: false,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    start: null,
    today: new Date().toISOString().substring(0, 10)
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      categories: state => state.categories,
      defaultModalProps: state => state.defaultModalProps,
      events: state => state.events,
      filterCategory: state => state.filterCategory,
      filterDrawer: state => state.filterDrawer,
      filterRangeDate: state => state.filterRangeDate,
      filterSearch: state => state.filterSearch,
      imagePreviewData: state => state.imagePreviewData,
      modalImageFullPreview: state => state.modalImageFullPreview,
      patrons: state => state.patrons
    }),
    ...mapGetters(['categoriesById']),
    eventsList() {
      let eventsFiltered = []
      const filterNames = ['filterCategory', 'filterRangeDate', 'filterSearch']
      let filtersSet = {}
      filterNames.forEach(f =>
        this[f] && this[f].length > 0 ? (filtersSet[f] = this[f]) : null
      )
      if (Array.isArray(this.events)) {
        this.events.forEach(e => {
          eventsFiltered.push(
            formats.eventDetailed(e, this.catalogItems, this.patrons)
          )
        })

        if (Object.keys(filtersSet).length > 0) {
          if (filtersSet.filterCategory) {
            eventsFiltered = eventsFiltered.filter(
              e => filtersSet.filterCategory.indexOf(e.ciData?.category) > -1
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
                e?.ciData &&
                (filters.findStringMatchesInObj(
                  e.ciData,
                  possibleKeysCi,
                  filtersSet.filterSearch
                ) ||
                  filters.findStringMatchesInObj(
                    e.patronData,
                    possibleKeysPatron,
                    filtersSet.filterSearch
                  ))
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

      switch (this.calendarView) {
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
        height = height - 180
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  },
  methods: {
    test(e) {
      console.log('test')
      console.log(e)
    },
    calendarCheckChanges() {
      //args =event
      this.$refs.calendar.checkChange()
      if (this.selectedOpen) {
        this.selectedOpen = false
      }
    },
    eventColor(e) {
      let item = filters.getObjectFromArray(this.catalogItems, 'id', e.item_id)
      return this.filterCategory.length === 1
        ? item.color
        : this.categoriesById[item.category].color
    },
    eventLabel(v) {
      let start = timestampHuman(v.start_date, false, false)
      let end = timestampHuman(v.end_date, false, false)
      if (start === end) {
        start = timeHuman(v.start.time)
        end = timeHuman(v.end.time)
      }
      let label = `
        <span id="${v.ciData.abbreviation}" class="mx-2 subtitle-2">
          <strong>${v.ciData.abbreviation}</strong>
          ${v?.patronData?.last_name || '-'} ${start} - ${end}

        </span>
      `

      return label
    },
    eventAdd() {
      this.showDetails({ type: 'edit' })
    },
    eventEdit(e) {
      if (e) {
        this.$store.dispatch('setStateValue', {
          key: 'eventEditing',
          value: e
        })
        this.modalDetailsComp = 'eventEdit'
        setTimeout(() => (this.modalDetailsShow = true), 19)
      }
    },
    contextDay(e) {
      //right click day
      return e
    },
    focusToday() {
      this.calendarFocus = this.today
      this.datePickerShow = false
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarFocus',
        data: this.calendarFocus,
        isReference: false
      })
    },
    formatEventPreview(e) {
      return formats.eventPreview(e, this.categories)
    },
    getEventById(eid) {
      const eventKey = this.events.findIndex(event => event.id === eid)
      return eventKey > -1 ? this.events[eventKey] : null
    },
    getEventKeyById(eid) {
      return this.events.findIndex(event => event.id === eid)
    },
    setCalendarView(view) {
      this.calendarView = view
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarView',
        data: this.calendarView,
        isReference: false
      })
    },
    setLayoutView() {
      this.layoutView =
        this.layoutView === 'calendar'
          ? 'list'
          : this.layoutView === 'list'
          ? 'calendar'
          : 'list'
      this.$store.dispatch('localStorageWrite', {
        key: 'layoutView',
        data: this.layoutView,
        isReference: false
      })
    },
    setToday() {
      this.calendarFocus = this.today
    },
    showEventsModal() {
      console.log('showEventsModal')
    },
    prev() {
      // v-show calendar to retain refs
      // if (this.calendarView === 'month') this.$refs.calendar.prev()
      this.$refs.calendar.prev()
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarFocus',
        data: this.calendarFocus,
        isReference: false
      })
    },
    next() {
      // v-show calendar to retain refs
      // if (this.calendarView === 'month') this.$refs.calendar.next()
      this.$refs.calendar.next()
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarFocus',
        data: this.calendarFocus,
        isReference: false
      })
    },
    onDetailsAction(a) {
      return a
    },
    onDetailsClose(e) {
      this.modalDetailsShow = false
      this.$store.dispatch('setStateValue', {
        key: 'eventEditing',
        value: null
      })
      if (e && e.wasDeleted) {
        this.selectedOpen = false
      }
    },
    onHeightChange(height) {
      localStorage.setItem('calendarMonthHeight', height)
    },
    showDetails(e) {
      this.modalDetailsProps = this.defaultModalProps
      switch (e.type) {
        case 'ci':
          this.modalDetailsCompData = {
            item: this.selectedEvent?.eventData?.ciData || null,
            showDetailBtn: false
          }
          this.modalDetailsComp = 'ciDetails'
          break
        case 'edit':
          this.modalDetailsComp = 'eventEdit'
          break
        case 'event':
          this.modalDetailsCompData = {
            'max-width': 'unset',
            showDetailBtn: false
          }
          this.modalDetailsComp = 'eventDetails'
          break
        case 'patron':
          this.modalDetailsCompData = {
            patron: this.selectedEvent?.eventData?.patronData || null,
            showDetailsBtn: false
          }
          this.modalDetailsComp = 'patronDetails'
          break
        default:
          this.modalDetailsComp = null
          //TODO: maybe set no match for generic error
          break
      }
      if (this.modalDetailsComp) {
        setTimeout(() => (this.modalDetailsShow = true), 19)
      }
    },
    showEventMenu({ nativeEvent, event }) {
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
    updatedSelectedEvent() {
      const event = this.events.find(e => e.id === this.selectedEvent.id)
      this.selectedEvent = this.formatEventPreview(event)
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    viewDay({ date }) {
      this.calendarFocus = date
      this.setCalendarView('day')
    }
  },
  mounted() {
    this.isLoaded = true
    const lastFilterDrawerState = localStorage.getItem('filterDrawer')
    if (lastFilterDrawerState === null && this.$vuetify.breakpoint.lgAndUp)
      this.$store.dispatch('setStateValue', {
        key: 'filterDrawer',
        value: true
      })

    const calMonthHeight = localStorage.getItem('calendarMonthHeight')
    if (calMonthHeight) this.calendarMonthHeight = calMonthHeight
    if (lastFilterDrawerState === 'true' && !this.filterDrawer)
      this.$store.dispatch('toggleStateValue', 'filterDrawer')
  },
  created() {
    this.calendarFocus = localStorage.getItem('calendarFocus') || this.today
    this.calendarView =
      localStorage.getItem('calendarView') || this.calendarView
    this.layoutView = localStorage.getItem('layoutView') || this.layoutView
  }
}
</script>

<style></style>
