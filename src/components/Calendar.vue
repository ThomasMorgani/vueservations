<template>
  <v-row class="fill-height" dense>
    <v-col cols="12">
      <v-sheet height="10vh">
        <v-toolbar flat color="white">
          <!-- <v-btn outlined class="mr-4" @click="setToday">Today</v-btn> -->
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
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
          <v-btn outlined class="mr-4" @click="eventAdd">
            <v-icon left>mdi-bookmark-plus-outline</v-icon>NEW
          </v-btn>
        </v-toolbar>
      </v-sheet>
    </v-col>
    <v-col cols="12">
      <!-- <v-sheet height="calc(100vh - 64px)" style="overflow-y: scroll;"> -->
      <v-sheet height="75vh" style="overflow-y: scroll">
        <v-sheet :height="type === 'month' ? calendarMonthHeight : '100%'">
          <v-calendar
            ref="calendar"
            v-model="focus"
            color="primary"
            :events="events"
            :event-color="getColor"
            :event-margin-bottom="2"
            event-name="title"
            event-start="startDate"
            event-end="endDate"
            :now="today"
            :type="type"
            @click:event="showEvent"
            @click:more="viewDay"
            @click:date="viewDay"
            @change="updateRange"
            @contextmenu:day="contextDay"
          >
            <!-- <template v-slot:day="day">
              <v-sheet :color="color" class="white--text pa-1">{{day}}</v-sheet>
            </template>-->
          </v-calendar>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            offset-x
          >
            <eventDetailsCard
              :event="selectedEvent"
              @closeDetails="selectedOpen = false"
              @deleteEvent="eventDelete"
              @editEvent="eventEdit"
            ></eventDetailsCard>
          </v-menu>
        </v-sheet>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
import eventDetailsCard from "@/components/eventDetailCard";
export default {
  name: "Calendar",
  components: {
    eventDetailsCard
  },
  data: () => ({
    today: new Date().toISOString().substring(0, 10),
    focus: new Date().toISOString().substring(0, 10),
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days"
    },
    name: null,
    details: null,
    navDrawer: false,
    start: null,
    end: null,
    calendarMonthHeight: 1000,
    color: "#000066",
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialog: false
  }),
  computed: {
    ...mapState({
      filter: state => state.filter
    }),
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "Default Month";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;

      const startDay = start.day + this.nth(start.day);
      const endDay = end.day + this.nth(end.day);

      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long"
      });
    }
  },
  methods: {
    initializeApp() {
      console.log("get events method");
      this.axios
        .get(`${this.$apiSettings.baseUrl}/initialize_page_data`)
        .then(response => {
          console.log(response);
          if (response.data && response.data.reservations) {
            // response.data.reservations.forEach(res => this.events.push({...res, name: res.title, start: res.startDate, end: res.endDate}))
            this.events = response.data.reservations;
          }
          // if (response.data) {
          //   this.device = [];
          //   this.events = [];
          //   this.eventsShown = [];
          //   this.devicesFilter = [];
          //   this.devices = response.data.devices;
          //   this.events = response.data.reservations;
          //   for (let device in this.devices) {
          //     this.dropDownList.push({
          //       text: "Hot Spot" + this.devices[device]["id"],
          //       value: this.devices[device]["device"]
          //     });
          //     this.devicesFilter.push(device);
          //   }
          //   filterDevices();
          // }
        })
        .catch(e => {
          console.log(e);
        });
    },
    eventAdd() {
      console.log("eventAdd");
    },
    eventDelete(eid) {
      //expects event id
      console.log(eid);
    },
    eventEdit(eid) {
      //expects event id
      console.log(eid);
      console.log(this.getEventById(eid));
      let event = this.getEventById(eid);
      if (event) {
        console.log("event found open modal");
      } else {
        console.log("error: event not found");
      }
    },
    contextDay(e) {
      console.log(e);
    },
    formatEventPreview(event) {
      //this will format each reservation until we do so in backend
      let formattedEvent = {};
      console.log(event);
      switch (parseInt(event.itemCategory)) {
        case 1:
          formattedEvent = {
            title: event.title,
            id: event.id,
            class: {
              color: event.classes
            },
            details: {
              Item: event.device,
              "First Name": event.patronInfo.first,
              "Last Name": event.patronInfo.last,
              Barcode: event.patronInfo.barcode,
              "Start Date": event.startDate,
              "End Date": event.endDate,
              Notes: event.Notes
            }
          };
          return formattedEvent;
        default:
          formattedEvent = {
            title: event.title || "",
            id: event.id || null,
            class: {
              color: event.classes || "primary"
            },
            details: {
              Details: "Unknown Device Category. "
            }
          };
          return formattedEvent;
      }
    },
    getColor(e) {
      return e.classes;
    },

    getEventById(eid) {
      const eventKey = this.events.findIndex(event => event.id === eid);
      return eventKey > -1 ? this.events[eventKey] : null;
    },
    getEventKeyById(eid) {
      return this.events.findIndex(event => event.id === eid);
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = this.formatEventPreview(event);
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        if (this.selectedElement !== nativeEvent.target) {
          setTimeout(open, 10);
        }
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      this.start = start;
      this.end = end;
    },
    nth(d) {
      return d > 3 && d < 21
        ? "th"
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    }
  },
  mounted() {
    this.initializeApp();
  }
};
</script>

<style></style>
