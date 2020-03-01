<template>
  <!-- <v-card flat color="background"> -->
  <v-card flat>
    <v-card-title class="d-flex space-between align-center">
      <!-- <v-card-title class="pa-0"> -->
      <span class="headline font-weight-medium primary--text">CATALOG</span>
      <v-spacer></v-spacer>
      <v-icon left color="primary">mdi-filter</v-icon>
      <span class="body-1 font-weight-bold">
        {{
        `${itemList.length} of ${catalogItems.length}`
        }}
      </span>
    </v-card-title>
    <v-card-text :style="styleCiList">
      <v-expansion-panels popout v-model="panel" class="py-1">
        <!-- <template v-for="(item, key) in limitBy(itemsDisplayed, itemDisplayLimit)"> -->
        <template v-for="(item, key) in orderBy(itemList, 'name')">
          <catalogItem
            :key="item.id ? item.id : key + 'ci'"
            :item="item"
            :statusData="statusData"
            @reserve="onReserve"
          ></catalogItem>
          <!-- <catalogItem :key="item.id" :item="item" :isActivePanel="key === panel"></catalogItem> -->
        </template>
      </v-expansion-panels>
    </v-card-text>
    <v-dialog v-model="modal" max-width="800px" transition="dialog-transition">
      <component :key="modal + modalComp" :is="modalComp" @close="onModalClose"></component>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Vue2Filters from 'vue2-filters'
import filters from '@/modules/filters'
import * as formats from '@/modules/formats'

import catalogItem from '@/components/catalog/catalogItem'
export default {
  name: 'catalogList',
  components: {
    catalogItem,
    eventEdit: () => import('@/components/calendar/eventEdit')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    modal: false,
    modalComp: null,
    panel: null,
    statusData: {
      available: {
        color: 'success',
        icon: 'mdi-calendar-check',
        popovertext: 'Item is available for reservation',
        text: 'AVAILABLE'
      },
      blocked: {
        color: 'error',
        icon: 'mdi-phone-cancel',
        popovertext: "Item's service blocked",
        text: 'BLOCKED'
      },
      enabled: {
        color: 'success',
        icon: 'mdi-check-circle',
        popovertext: 'Item is enabled',
        text: 'ENABLED'
      },
      disabled: {
        color: 'error',
        icon: 'mdi-cancel',
        popovertext: 'Item is disabled',
        text: 'DISABLED'
      },
      unavailable: {
        color: 'warning',
        icon: 'mdi-calendar-alert',
        popovertext: 'Item is currently reserved',
        text: 'UNAVAILABLE'
      },
      unkown: {
        color: 'disabled',
        icon: 'mdi-help-circle',
        popovertext: 'Item status unknown',
        text: 'STATUS UNK'
      }
    }
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      categories: state => state.categories,
      filterAvailability: state => state.filterAvailability,
      filterCategory: state => state.filterCategory,
      filterRangeDate: state => state.filterRangeDate,
      filterSearch: state => state.filterSearch,
      filterStatus: state => state.filterStatus
    }),
    itemList() {
      let cItemsFiltered = []
      const filterNames = [
        'filterAvailability',
        'filterCategory',
        'filterRangeDate',
        'filterSearch',
        'filterStatus'
      ]
      let filtersSet = {}
      filterNames.forEach(f =>
        this[f] && this[f].length > 0 ? (filtersSet[f] = this[f]) : null
      )

      if (Array.isArray(this.catalogItems)) {
        this.catalogItems.forEach(ci => {
          cItemsFiltered.push(this.formatCatalogItemData(ci))
        })
      }

      if (Object.keys(filtersSet).length > 0) {
        if (filtersSet.filterAvailability) {
          cItemsFiltered = cItemsFiltered.filter(ci =>
            filtersSet.filterAvailability === 'available'
              ? ci.isAvailable
              : !ci.isAvailable
          )
        }
        if (filtersSet.filterCategory) {
          cItemsFiltered = cItemsFiltered.filter(ci =>
            filtersSet.filterCategory.includes(ci.category)
          )
        }

        if (filtersSet.filterStatus) {
          cItemsFiltered = cItemsFiltered.filter(ci =>
            filtersSet.filterStatus.includes(ci.status.toUpperCase())
          )
        }

        if (filtersSet.filterSearch) {
          const possibleKeys = [
            'abbreviation',
            'categoryName',
            'description',
            'name',
            'status'
          ]
          cItemsFiltered = cItemsFiltered.filter(ci => {
            return filters.findStringMatchesInObj(
              ci,
              possibleKeys,
              filtersSet.filterSearch
            )
          })
        }
      }

      return cItemsFiltered
    },
    styleCiList() {
      let height = this.$store.state.content.main.y || null
      if (height) {
        height = height - 250
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  },
  methods: {
    formatCatalogItemData(catalogItem) {
      //format data to be passed to list item
      if (catalogItem && catalogItem.name) {
        const category = filters.categoryById(
          catalogItem.category,
          this.categories
        )
        catalogItem.categoryName = category.name || 'MISC'
        // catalogItem.customFields = cata

        if (catalogItem.lastReservation && catalogItem.lastReservation['0']) {
          let now = new Date()
          catalogItem.isAvailable = !filters.testRangeOverlap(
            catalogItem.lastReservation['0'].start_date,
            catalogItem.lastReservation['0'].end_date,
            now,
            now
          )
        } else {
          catalogItem.isAvailable = true
        }

        return formats.catalogItem(catalogItem)
      } else {
        console.log('no cat')
        return formats.catalogItem(catalogItem)
      }
    },
    onModalClose() {
      console.log('ci list modal closed')
      this.modal = false
      this.$store.dispatch('setStateValue', {
        key: 'eventediting',
        value: null
      })
    },
    onReserve(e) {
      console.log('onReserve')
      console.log(e)
      if (e) {
        this.$store.dispatch('setStateValue', {
          key: 'eventediting',
          value: { ciData: e }
        })
        this.modalComp = 'eventEdit'
        setTimeout(() => (this.modal = true), 19)
        console.log('event found open modal')
      } else {
        console.log('error: ci not found')
      }
    }
  }
}
</script>

<style></style>
