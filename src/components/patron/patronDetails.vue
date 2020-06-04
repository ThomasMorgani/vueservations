<template>
  <v-card width="800">
    <v-card-text class="pa-5">
      <v-row dense align="center" justify="center">
        <v-col cols="2" align-self="center" class="d-flex justify-center">
          <v-avatar size="60" color="primary">
            <v-icon size="x-large" color="secondary">mdi-account</v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text ml-5">
              {{ `${patron.first_name} ${patron.last_name}` }}
            </span>
          </v-row>

          <v-row dense class="display-flex align-center justify-start">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-avatar
                    size="10"
                    color="primary"
                    class="mr-1 ml-5"
                  ></v-avatar>
                  <p
                    v-html="'Group'"
                    class="font-italic subheading text-capitalize"
                    style="display: inline;"
                  ></p>
                </div>
              </template>
              <span>
                <p class="mb-1">
                  <strong>Group</strong>
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
                disabled
                text
                icon
                color="primary"
                @click="showNotes"
                v-on="on"
              >
                <v-icon color="primary">mdi-note-text-outline</v-icon>
              </v-btn>
            </template>
            <span>Notes</span>
          </v-tooltip>
        </v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn text icon @click="showReservations" v-on="on">
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </v-btn>
            </template>
            <span>View Reservations</span>
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
            @cancel="modal = false"
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
import * as formats from '@/modules/formats.js'
import Vue2Filters from 'vue2-filters'
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
export default {
  name: 'patronDetails',
  components: {
    btnWithTooltip,
    patronHistory: () => import('@/components/patron/patronHistory')
  },
  mixins: [Vue2Filters.mixin],
  props: {
    expandDetails: {
      type: Boolean,
      required: false,
      default: () => true
    },
    patron: {
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
          name: 'First Name',
          value: this.patron.first_name || '-'
        },
        {
          name: 'Last Name',
          value: this.patron.last_name || '-'
        },
        {
          name: 'Barcode',
          value: this.patron.barcode || '-'
        },
        {
          name: 'Email',
          value: this.patron.email || '-'
        },
        {
          name: 'Phone',
          value: this.patron.phone || '-'
        },
        {
          name: 'Notes',
          value: this.patron.notes || '-'
        }
      ]
    }
  },
  methods: {
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
        patron: this.patron,
        tableData: {
          headers: [
            {
              value: 'catalog_item',
              text: 'CATALOG ITEM'
            },
            {
              value: 'start_date',
              text: 'START'
            },
            {
              value: 'end_date',
              text: 'END'
            }
          ],
          items: this.orderBy(
            formats.patronHistorySimple(
              this.events.filter(e => e.patron_id == this.patron.id),
              this.catalogItems
            ),
            'start_date'
          ),
          height: 400
        }
      }
      this.modalComp = 'patronHistory'
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
<style scoped></style>
