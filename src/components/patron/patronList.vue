<template>
  <v-card flat>
    <v-card-title
      class="title primary--text font-weight-bold d-flex align-center pb-0"
    >
      PATRONS
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        name="Search"
        label="Search"
        outlined
        dense
        clearable
        prepend-inner-icon="mdi-account-search"
        hide-details
        color="primary"
      ></v-text-field>

      <BtnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-account-plus' }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Add Patron'"
        @click="patronAdd()"
      ></BtnWithTooltip>
    </v-card-title>

    <v-card-text class="pt-4 text-center">
      <v-sheet v-if="!patronsList || patronsList.length < 1">
        <p class="font-weight-bold primary--text">No patrons found.</p>
        <v-btn color="primary" outlined @click="patronAdd()"
          ><v-icon left>mdi-account-plus</v-icon> NEW PATRON</v-btn
        >
      </v-sheet>
      <tableAdvanced
        v-else
        :tableData="tableData"
        @actionBtn="onAction"
      ></tableAdvanced>
    </v-card-text>
    <v-dialog
      v-model="modalAction"
      scrollable
      persistent=""
      max-width="1000px"
      transition="dialog-transition"
    >
      <component
        :is="modalComp"
        :key="modalAction"
        v-bind="modalCompData"
        @actionBtn="onAction"
        @cancel="modalClose"
        @close="modalClose"
      ></component>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters.js'
import * as formats from '@/modules/formats.js'
import Vue2Filters from 'vue2-filters'

import tableAdvanced from '@/components/global/tableAdvanced'
export default {
  name: 'patronList',
  components: {
    patronDelete: () => import('@/components/patron/patronDelete'),
    // patron: () => import('@/components/patron/patronDelete'),
    patronDetails: () => import('@/components/patron/patronDetails'),
    patronEdit: () => import('@/components/patron/patronEdit'),
    patronHistory: () => import('@/components/patron/patronHistory'),
    tableAdvanced
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    modalAction: false,
    modalComp: null,
    modalCompData: null,
    search: null
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      events: state => state.events,
      patrons: state => state.patrons
    }),
    patronsList() {
      let list = this.patrons
      if (this.search) {
        list = list.filter(i =>
          filters.findStringMatchesInObj(
            i,
            ['first_name', 'last_name', 'barcode'],
            this.search
          )
        )
      }
      return list
    },
    tableData() {
      return {
        headers: [
          {
            value: 'last_name',
            text: 'LAST',
            sortable: true,
            width: this.$store.state.content.main.x / 4
          },
          {
            value: 'first_name',
            text: 'FIRST',
            sortable: true,
            width: this.$store.state.content.main.x / 4
          },
          {
            value: 'barcode',
            text: 'BARCODE',
            sortable: true,
            width: this.$store.state.content.main.x / 4
          }
        ],
        items: this.patronsList,
        actions: ['edit', 'details'],
        height: this.$store.state.content.main.y - 200
      }
    }
  },
  methods: {
    historyShow(patron) {
      this.modalCompData = {
        patron: patron,
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
              this.events.filter(e => e.patron_id == patron.id),
              this.catalogItems
            ),
            'start_date'
          ),
          height: 400
        }
      }
      this.modalComp = 'patronHistory'
      this.modalAction = true
    },
    modalClose() {
      if (this.modalComp === 'patronDelete') {
        this.modalComp = 'patronEdit'
        return
      }
      this.modalAction = false
    },
    // onAction({ action, rowIndex, item }) {
    onAction({ action, item }) {
      switch (action) {
        case 'add':
          this.addPatron()
          break
        case 'delete':
          this.patronDeletePrompt(item)
          break
        case 'deleteConfirm':
          this.patronDelete(this.modalCompData.patron.id)
          break
        case 'details':
          this.patronDetails(item)
          break
        case 'edit':
          this.patronEdit(item)
          break
        case 'history':
          this.historyShow(item)
          break
        default:
        //console.log('default reached')
        //console.log(action)
        //console.log(item)
      }
    },
    patronAdd() {
      this.$store.dispatch('setStateValue', {
        key: 'patronEditing',
        value: null
      })
      this.modalComp = 'patronEdit'
      this.modalAction = true
    },
    patronDelete(patron) {
      //remove patron, patron linked events
      //setState
      this.$store.dispatch('setStateValue', {
        key: 'patrons',
        value: this.patrons.filter(p => p.id != patron)
      })
      this.$store.dispatch('setStateValue', {
        key: 'events',
        value: this.events.filter(e => e.patron_id != patron)
      })
      this.$store.dispatch('localStorageWrite', {
        key: 'patrons',
        data: this.patrons
      })
      this.$store.dispatch('localStorageWrite', {
        key: 'events',
        data: this.events
      })
      this.$store.dispatch('toggleSnackbar', {
        status: 'success',
        message: 'Patron deleted.'
      })
      this.modalAction = false
      return true
    },
    patronDeletePrompt(patron) {
      this.modalCompData = {
        patron: patron,
        affectedEvents: {
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
              this.events.filter(e => e.patron_id == patron.id),
              this.catalogItems
            ),
            'start_date'
          ),
          height: 200
        }
      }
      this.modalComp = 'patronDelete'
      this.modalAction = true
    },
    patronDetails(patron) {
      this.modalCompData = {
        patron: patron
      }
      this.modalComp = 'patronDetails'
      this.modalAction = true
    },
    patronEdit(patron) {
      this.$store.dispatch('setStateValue', {
        key: 'patronEditing',
        value: patron
      })
      this.modalComp = 'patronEdit'
      this.modalAction = true
    }
  }
}
</script>

<style></style>
