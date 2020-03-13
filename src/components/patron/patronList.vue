<template>
  <v-card>
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

      <btnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-account-plus' }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Add Patron'"
        @click="patronAdd()"
      ></btnWithTooltip>
    </v-card-title>

    <v-card-text class="pt-0">
      <tableAdvanced
        :tableData="tableData"
        @actionBtn="onAction"
      ></tableAdvanced>
    </v-card-text>
    <v-dialog
      v-model="modalAction"
      scrollable
      persistent=""
      max-width="700px"
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

import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
import tableAdvanced from '@/components/global/tableAdvanced'
export default {
  name: 'patronList',
  components: {
    btnWithTooltip,
    patronDelete: () => import('@/components/patron/patronDelete'),
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
      // return this.tableData.items
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
        actions: ['delete', 'edit', 'history'],
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
      //dispatch api
      this.$store
        .dispatch('apiCall', {
          endpoint: '/patron/' + patron
        })
        .then(resp => {
          if (resp.status === 'success') {
            //console.log(patron)
            const pId = this.patrons.findIndex(p => p.id == patron)
            //console.log(pId)
            if (pId > -1) {
              this.$store.dispatch('deleteStateValueByKey', {
                stateItem: 'patrons',
                key: pId
              })
              // const spl = this.patrons.splice(pId, 1)
              // //console.log(spl)
            }
            this.$store.dispatch('setStateValue', {
              key: 'events',
              value: this.events.filter(e => e.patron_id != patron)
            })
            this.modalAction = false
          }
        })
        .catch(err => console.log(err))
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
