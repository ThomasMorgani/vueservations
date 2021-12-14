<template>
  <v-card width="800">
    <v-card-text class="pa-5">
      <v-row dense align="center" justify="center">
        <v-col cols="2" align-self="center" class="d-flex justify-center">
          <v-avatar size="60" color="primary">
            <v-icon size="x-large" color="secondary">mdi-calendar-range</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text ml-5">
              {{
                `${event.eventData.ciData.name}: ${event.eventData.patronData.last_name}`
              }}
            </span>
          </v-row>
          <v-row dense class="display-flex align-center justify-start">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-avatar
                    size="10"
                    color="warning"
                    class="mr-1 ml-5"
                  ></v-avatar>
                  <p
                    v-html="'Pending'"
                    class="font-italic subheading text-capitalize"
                    style="display: inline;"
                  ></p>
                </div>
              </template>
              <span>
                <p class="mb-1">
                  <strong>Status (active, ended, pending)</strong>
                </p>
                <v-avatar size="15" color="primary" class="mr-1"></v-avatar>
                {{ 'Group Name' }}
              </span>
            </v-tooltip>
          </v-row>
          <v-row dense align="center" justify="start" class="my-2">
            <!-- STATUS -->
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
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                text
                icon
                color="primary"
                @click="showCatalogItem"
                v-on="on"
              >
                <v-icon color="primary">mdi-layers-search</v-icon>
              </v-btn>
            </template>
            <span>View Catalog Item Details</span>
          </v-tooltip>
        </v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn text icon @click="showPatron" v-on="on">
                <v-icon color="primary">mdi-account-search</v-icon>
              </v-btn>
            </template>
            <span>View Patron Details</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row justify="start" v-if="showDetails">
        <v-col cols="8" offset="2" class="text-left pt-0">
          <v-divider inset></v-divider>
        </v-col>
        <v-col cols="8" offset="2" class="text-right">
          <v-row
            dense
            v-for="(detail, i) in details"
            :key="i"
            align="center"
            justify-center
          >
            <v-col
              cols="3"
              class=" primary--text font-weight-bold text-left text-no-wrap"
              >{{ detail.name }}</v-col
            >
            <v-col cols="8" class="text-no-wrap text-left font-weight-bold">
              {{ detail.value }}
            </v-col>
          </v-row>
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
import { mapState } from 'vuex'
// import * as formats from '@/modules/formats.js'
import Vue2Filters from 'vue2-filters'
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
export default {
  name: 'eventDetails',
  components: {
    btnWithTooltip,
    ciDetails: () => import('@/components/catalog/catalogItem/ciDetails'),
    patronDetails: () => import('@/components/patron/patronDetails')
  },
  mixins: [Vue2Filters.mixin],
  props: {
    event: {
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
    ...mapState({
      catalogItems: state => state.catalogItems,
      events: state => state.events,
      patrons: state => state.patrons
    }),
    details() {
      return [
        {
          name: 'Item',
          value: this.event.eventData.ciData.name || '-'
        },
        {
          name: 'Patron',
          value:
            this.event.eventData.patronData.first_name +
              ' ' +
              this.event.eventData.patronData.last_name || '-'
        },
        {
          name: 'Start',
          value: this.event.eventData.start_date || '-'
        },
        {
          name: 'End',
          value: this.event.eventData.end_date || '-'
        },
        {
          name: 'Duration',
          value: 'X Days..' || '-'
        },
        {
          name: 'Notes',
          value: this.event.eventData.notes || '-'
        }
      ]
    }
  },
  methods: {
    showCatalogItem() {
      this.modalComp = 'ciDetails'
      this.modalCompData = { item: this.event.eventData.ciData }
      this.modal = true
    },
    showPatron() {
      this.modalComp = 'patronDetails'
      this.modalCompData = { patron: this.event.eventData.patronData }
      this.modal = true
    }
  }
}
</script>
<style scoped></style>
