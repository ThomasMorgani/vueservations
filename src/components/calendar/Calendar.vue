<template>
  <v-row fill-height align-start justify-start dense no-gutters>
    <v-col cols="12">
      <v-toolbar
        height="40"
        flat
        color="background"
        class="d-flex align-center justify-space-between primary--text"
      >
        <!-- FOCUS TODAY BTN -->
        <!-- <btn-with-tooltip
          :btnProps="{ small: true }"
          :iconProps="{ icon: 'mdi-calendar-star' }"
          :tooltipProps="{ bottom: true }"
          tooltipText="Focus today"
          @click="setToday"
        ></btn-with-tooltip> -->
        <v-sheet
          color="transparent"
          width="150"
          class="d-flex align-center justify-start flex-shrink-1 flex-grow-0"
        >
          <!-- EVENT VIEW MENU -->
          <v-menu bottom>
            <template v-slot:activator="{ on: menu }">
              <v-tooltip color="primary" bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn icon v-on="{ ...tooltip, ...menu }">
                    <v-icon color="primary">
                      {{ eventViewTypes[eventView].icon }}
                    </v-icon>
                  </v-btn>
                </template>
                <span
                  v-html="
                    formatTooltipHtml(
                      'Event view',
                      eventViewTypes[eventView].text
                    )
                  "
                ></span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item
                v-for="viewItem in Object.values(eventViewTypes)"
                :key="viewItem.value"
                @click="setEventView(viewItem.value)"
              >
                <v-tooltip :color="viewItem.disabled ? '' : 'primary'" right>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      :color="
                        viewItem.value === eventView ? 'primary' : 'disabled'
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

          <!-- CALENDAR HEIGHT / LIST SORT / TABLE COLUMNS-->
          <!-- SORT BUTTON -->
          <btn-sort-menu
            v-if="eventView === 'list'"
            @change="onEventColumnChange"
          ></btn-sort-menu>
          <!-- CAL HEIGHT SLIDER -->
          <v-menu
            v-if="eventView === 'calendar'"
            :close-on-content-click="false"
            bottom
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-sheet v-on="on" color="transparent">
                <btn-with-tooltip
                  :btnProps="{
                    icon: true
                  }"
                  :iconProps="{ icon: 'mdi-arrow-split-horizontal' }"
                  :tooltipProps="{ bottom: true }"
                  tooltipText="Calendar height"
                ></btn-with-tooltip>
              </v-sheet>
            </template>
            <v-card tile>
              <v-card-text>
                <v-slider
                  v-model="calendarMonthHeight"
                  :color="color"
                  hide-details
                  max="3500"
                  :min="calHeight || 800"
                  track-color="grey"
                  vertical
                  @input="onHeightChange"
                ></v-slider>
              </v-card-text>
            </v-card>
          </v-menu>
          <!-- TABLE COLUMNS MENU -->
          <btn-event-table-column-menu
            v-if="eventView === 'table'"
            :selectedColumns="calendarTableColumns"
          ></btn-event-table-column-menu>

          <!-- PERIOD VIEW MENU -->
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
                <span
                  v-html="
                    formatTooltipHtml(
                      'Period view',
                      calendarViewTypes[calendarView].text
                    )
                  "
                ></span>
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
        </v-sheet>
        <v-sheet
          color="transparent"
          class="d-flex align-center justify-center flex-shrink-0 flex-grow-1"
        >
          <!-- CURRENT PERIOD  -->
          <v-btn color="primary" icon small text @click="prev">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title>
            <v-menu
              ref="datePickerMenu"
              v-model="datePickerShow"
              :close-on-content-click="false"
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
              <!-- @input="
                  setFocus(`${$event}${calendarView === 'month' ? '-01' : ''}`)
                " -->
              <!-- :value="calendarFocus" -->
              <!-- :type="'date'" -->
              <v-date-picker
                :key="calendarView"
                no-title
                scrollable
                show-current
                :type="calendarView === 'month' ? 'month' : 'date'"
                :value="calendarFocus"
                @input="setFocus"
                @update:picker-date="setFocus"
              >
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
          <v-btn color="primary" icon small text @click="next">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet
          color="transparent"
          width="150"
          class="d-flex align-center justify-end flex-shrink-1 flex-grow-0"
        >
          <!-- ADD EVENT BTN -->
          <btn-with-tooltip
            :btnProps="{
              icon: true
            }"
            :iconProps="{ icon: 'mdi-calendar-plus' }"
            :tooltipProps="{ bottom: true }"
            tooltipText="Add new event"
            @click="eventAdd"
          ></btn-with-tooltip>

          <!-- FILTER TOGGLE -->
          <filterBtn v-if="!filterDrawer"></filterBtn>
        </v-sheet>
      </v-toolbar>
    </v-col>
    <v-col cols="12">
      <!-- <v-sheet class="px-2" :height="calHeight" style="overflow-y: scroll;"> -->
      <v-sheet class="px-2" :height="calHeight" style="overflow-y: scroll;">
        <v-sheet
          v-show="isLoaded && eventView === 'calendar'"
          :height="calendarMonthHeight"
        >
          <!-- CALENDAR VIEW -->
          <v-calendar
            v-model="calendarFocus"
            color="primary"
            :events="orderBy(eventsList, 'name')"
            :event-color="eventColor"
            event-end="end_date"
            :event-margin-bottom="2"
            :event-height="20"
            event-overlap-mode="column"
            event-start="start_date"
            :now="today"
            ref="calendar"
            :type="calendarView"
            @click:date="viewDay"
            @click:event="showEventMenu"
            @click:more="showEventsModal"
            @change="updateRange"
            @contextmenu:day="contextDay"
          >
            <template #event="{event}">
              <v-sheet
                :color="eventColor(event)"
                height="20"
                class="d-flex align-center justify-start white--text  text-truncate px-1"
              >
                <!-- TODO: add setting for no chip, outline chip, filled chip -->
                <!-- :text-color="eventColor(event)" -->
                <v-chip color="secondary" x-small outlined
                  ><strong>{{
                    event.ciData ? event.ciData.abbreviation : 'UNK'
                  }}</strong></v-chip
                >
                <span v-html="eventLabel(event)" class="text-truncate"></span>
                <v-icon v-if="event.notes" small color="white"
                  >mdi-note-outline</v-icon
                >
              </v-sheet>
            </template>
          </v-calendar>
        </v-sheet>

        <!-- LIST VIEW -->
        <eventList
          v-if="isLoaded && eventView === 'list'"
          :events="eventsList"
          :dateRange="{ end, start }"
          @showDetails="showDetails"
        ></eventList>
        <!-- TABLE VIEW -->
        <eventTable
          v-if="isLoaded && eventView === 'table'"
          :events="eventsList"
          :height="calHeight"
          :columnsDisplayed="calendarTableColumns"
          @showDetails="showDetails"
        ></eventTable>

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
            @editEvent="eventEdit"
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
        <!-- Edit Catalog Item Modal  -->
        <!-- <v-dialog
          v-model="modalCatalogItemEdit"
          persistent
          max-width="800px"
          transition="dialog-transition"
          :key="
            `ciEdit${String(
              catalogItemEditing && catalogItemEditing.id
                ? catalogItemEditing.id
                : 'none'
            )}`
          "
        >
          <catalogItemEdit :isNew="true"></catalogItemEdit>
        </v-dialog> -->
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
import btnEventTableColumnMenu from '@/components/global/buttons/btnEventTableColumnMenu'
import filterBtn from '@/components/global/buttons/btnFilterDrawerToggle'
import btnSortMenu from '@/components/global/buttons/btnSortMenu'
import eventTable from '@/components/calendar/eventTable'

import Vue2Filters from 'vue2-filters'

export default {
  name: 'Calendar',
  components: {
    btnEventTableColumnMenu,
    btnSortMenu,
    catalogItemEdit: () => import('@/components/catalog/catalogItem/ciEdit'),
    ciDetails: () => import('@/components/catalog/catalogItem/ciDetails'),
    eventEdit: () => import('@/components/calendar/eventEdit'),
    eventDetails: () => import('@/components/calendar/eventDetails'),
    eventList: () => import('@/components/calendar/eventList'),
    eventMenu,
    eventTable,
    filterBtn,
    imagePreviewModal: () => import('@/components/images/imagePreviewModal'),
    patronDetails: () => import('@/components/patron/patronDetails')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    calendarMonthHeight: 700,
    calendarFocus: null,
    calendarTableColumns: {
      item: ['abbreviation', 'name'],
      patron: ['first_name', 'last_name'],
      reservation: ['startDate', 'endDate']
    },
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
    eventViewTypes: {
      calendar: {
        icon: 'mdi-calendar',
        text: 'Calendar',
        value: 'calendar'
      },
      list: {
        icon: 'mdi-format-list-text',
        text: 'List',
        value: 'list'
      },
      table: {
        icon: 'mdi-table',
        text: 'Table',
        value: 'table'
      }
    },
    isLoaded: false,
    eventView: 'calendar',
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
      catalogItemEditing: state => state.catalogItemEditing,
      categories: state => state.categories,
      defaultModalProps: state => state.defaultModalProps,
      events: state => state.events,
      filterCategory: state => state.filterCategory,
      filterDrawer: state => state.filterDrawer,
      filterRangeDate: state => state.filterRangeDate,
      filterSearch: state => state.filterSearch,
      imagePreviewData: state => state.imagePreviewData,
      modalCatalogItemEdit: state => state.modalCatalogItemEdit,
      modalImageFullPreview: state => state.modalImageFullPreview,
      patrons: state => state.patrons
    }),
    ...mapGetters(['appSettingsByName', 'categoriesById']),
    // calendarFocus: {
    //   get() {
    //     console.log(this.calendarFocus)
    //     return this.calendarFocus
    //   },
    //   set(focus) {
    //     this.calendarFocus = `${focus}${
    //       focus.split('-').length < 3 ? '-01' : ''
    //     }`
    //     console.log(this.calendarFocus)
    //     this.$store.dispatch('localStorageWrite', {
    //       key: 'calendarFocus',
    //       data: this.calendarFocus,
    //       isReference: false
    //     })
    //   }
    // },
    eventsList() {
      let eventsFiltered = []
      const filterNames = ['filterCategory', 'filterRangeDate', 'filterSearch']
      let filtersSet = {}
      filterNames.forEach(f =>
        this[f] && this[f].length > 0 ? (filtersSet[f] = this[f]) : null
      )

      const eventsFocused = this.events.filter(e => {
        return filters.testRangeOverlap(
          this.start?.date || '',
          this.end?.date || '',
          e.start_date,
          e.end_date
        )
      })

      eventsFocused.forEach(e => {
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
    calHeight() {
      const { application, breakpoint } = this.$vuetify
      const { footer, top } = application
      const appHeight = breakpoint.height
      const height = appHeight - footer - top - 40 //40 for cal toolbar
      return height
    }
  },
  methods: {
    test(e) {
      console.log('test')
      console.log(e)
    },
    calendarCheckChanges() {
      //args =event
      console.log('xxx')
      this.$refs.calendar.checkChange()
      this.$refs.calendar.updateTimes()
      if (this.selectedOpen) {
        this.selectedOpen = false
      }
    },
    contextDay(e) {
      //right click day
      return e
    },
    eventColor(e) {
      let item = filters.getObjectFromArray(this.catalogItems, 'id', e.item_id)
      if (!item) {
        const {
          setting: defaultCategory
        } = this.appSettingsByName.Default_Category
        const category = this.categories.find(c => c.id == defaultCategory)
        return category.color
      }
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
        <span id="${v?.ciData?.abbreviation || 'UNK'}" class="mx-2 subtitle-2">

          ${v?.patronData?.last_name || '-'} ${start} - ${end}

        </span>
      `

      return label
    },
    eventAdd() {
      //prefill event edit modal with current focus date
      this.$store.dispatch('setStateValue', {
        key: 'eventEditing',
        value: { start_date: this.calendarFocus }
      })
      this.showDetails({ type: 'edit' })
    },
    eventEdit(e) {
      console.log(e)
      if (e) {
        this.$store.dispatch('setStateValue', {
          key: 'eventEditing',
          value: e
        })
        this.modalDetailsComp = 'eventEdit'
        setTimeout(() => (this.modalDetailsShow = true), 19)
      }
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
    formatTooltipHtml(line1, line2) {
      return `<strong>${line1}</strong> <br /> (${line2})`
    },
    getEventById(eid) {
      const eventKey = this.events.findIndex(event => event.id === eid)
      return eventKey > -1 ? this.events[eventKey] : null
    },
    getEventKeyById(eid) {
      return this.events.findIndex(event => event.id === eid)
    },
    onEventColumnChange(columns) {
      console.log(columns)
      this.calendarTableColumns = { ...columns }
    },

    setCalendarView(view) {
      this.calendarView = view
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarView',
        data: this.calendarView,
        isReference: false
      })
    },
    setEventView(view) {
      this.eventView = view
      this.$store.dispatch('localStorageWrite', {
        key: 'eventView',
        data: this.eventView,
        isReference: false
      })
    },
    setFocus(focus) {
      //ensure both picker date and month can parse focused Date
      const focusSplit = focus.split('-')
      //if only year is passed, ignore
      if (focusSplit.length < 2) return
      //if only year/month passed, append first dom
      this.calendarFocus = `${focus}${focusSplit.length < 3 ? '-01' : ''}`
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarFocus',
        data: this.calendarFocus,
        isReference: false
      })
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
      if (e?.event)
        this.selectedEvent = this.formatEventPreview({ ...e.event.eventData })
      this.modalDetailsProps = this.defaultModalProps
      switch (e.type) {
        case 'ci':
          this.modalDetailsCompData = {
            item: this.selectedEvent?.eventData?.ciData || null,
            showDetailsBtn: false
          }
          this.modalDetailsComp = 'ciDetails'
          break
        case 'edit':
          this.modalDetailsComp = 'eventEdit'
          break
        case 'event':
          this.modalDetailsCompData = {
            eventData: this.selectedEvent.eventData || null,
            'max-width': 'unset',
            showDetailsBtn: false
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
      this.start = { ...start }
      this.end = { ...end }
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
      this.setCalendarView('day')
      //wait until view loads, then pass focus date
      //because picker updates on input and overrides month update with
      //first dom
      this.$nextTick(() => this.setFocus(date))
    }
  },
  // watch: {
  //   calendarFocus(focus) {
  //     console.log(focus)
  //   }
  // },
  mounted() {
    this.isLoaded = true
    const lastFilterDrawerState = localStorage.getItem('filterDrawer')
    if (lastFilterDrawerState === null && this.$vuetify.breakpoint.lgAndUp)
      this.$store.dispatch('setStateValue', {
        key: 'filterDrawer',
        value: true
      })

    this.calendarMonthHeight =
      localStorage.getItem('calendarMonthHeight') || this.calHeight
    if (lastFilterDrawerState === 'true' && !this.filterDrawer)
      this.$store.dispatch('toggleStateValue', 'filterDrawer')

    const calTableColumns = JSON.parse(
      localStorage.getItem('calendarEventColumns')
    )
    if (calTableColumns) this.calendarTableColumns = { ...calTableColumns }
  },
  created() {
    this.calendarFocus = localStorage.getItem('calendarFocus') || this.today
    this.calendarView =
      localStorage.getItem('calendarView') || this.calendarView
    this.eventView = localStorage.getItem('eventView') || this.eventView
  }
}
</script>

<style scoped>
>>> .v-toolbar__content {
  width: 100%;
}

>>> .v-calendar-daily__pane {
  overflow-x: hidden;
}

>>> .v-chip {
  justify-content: center;
  min-width: 40px;
  padding: 0px 2px;
}
</style>
