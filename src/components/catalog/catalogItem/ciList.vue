<template>
  <v-card flat>
    <v-card-text :style="styleCiList" class="px-0 text-center">
      <v-sheet v-if="!itemList || itemList.length < 1">
        <p class="font-weight-bold primary--text">No catalog items found.</p>
        <v-btn color="primary" outlined @click="$emit('newItem')">
          <v-icon left>mdi-note-plus</v-icon> NEW ITEM
        </v-btn>
      </v-sheet>
      <v-expansion-panels v-else popout v-model="panel" class="py-1">
        <!-- <transition-group name="flip-list" mode="out-in" style="width: 100%"> -->
        <catalogItem
          v-for="item in orderBy(itemList, 'name')"
          :key="item.id"
          :item="item"
          :id="`CI${item.id}`"
          @reserve="onReserve"
          @showItemReservations="onShowReservations"
          @showItemNotes="onShowNotes"
          @showImage="onShowImage"
        ></catalogItem>
        <!-- </transition-group> -->
      </v-expansion-panels>
    </v-card-text>
    <v-dialog
      v-model="modal"
      max-width="800px"
      persistent
      transition="dialog-transition"
    >
      <component
        :key="modal + modalComp"
        :is="modalComp"
        v-bind="modalCompData"
        @close="onModalClose"
      ></component>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Vue2Filters from 'vue2-filters'
import filters from '@/modules/filters'
import * as formats from '@/modules/formats.js'

import catalogItem from '@/components/catalog/catalogItem/catalogItem'
export default {
  name: 'catalogList',
  components: {
    catalogItem,
    eventDetails: () => import('@/components/calendar/eventDetails'),
    eventEdit: () => import('@/components/calendar/eventEdit'),
    ciNotes: () => import('@/components/catalog/catalogItem/ciNotes'),
    ciReservations: () =>
      import('@/components/catalog/catalogItem/ciReservations')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    modal: false,
    modalComp: null,
    modalCompData: null,
    panel: null
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      catalogView: state => state.catalogView,
      categories: state => state.categories,
      events: state => state.events,
      filterAvailability: state => state.filterAvailability,
      filterCategory: state => state.filterCategory,
      filterRangeDate: state => state.filterRangeDate,
      filterSearch: state => state.filterSearch,
      filterStatus: state => state.filterStatus,
      filterVisibility: state => state.filterVisibility,
      patrons: state => state.patrons
    }),
    itemList() {
      let cItemsFiltered = []
      const filterNames = [
        'filterAvailability',
        'filterCategory',
        'filterRangeDate',
        'filterSearch',
        'filterStatus',
        'filterVisibility'
      ]
      let filtersSet = {}
      filterNames.forEach(f =>
        this[f] && this[f].length > 0 ? (filtersSet[f] = this[f]) : null
      )

      if (Array.isArray(this.catalogItems)) {
        this.catalogItems.forEach(ci => {
          cItemsFiltered.push(this.formatcatalogItemData(ci))
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

      if (filtersSet.filterVisibility) {
        cItemsFiltered = cItemsFiltered.filter(
          ci => ci.internal === filtersSet.filterVisibility
        )
      }
      return cItemsFiltered
    },
    styleCiList() {
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
    formatcatalogItemData(catalogItem) {
      //format data to be passed to list item
      if (catalogItem && catalogItem.name) {
        const category = filters.categoryById(
          catalogItem.category,
          this.categories
        )
        catalogItem.categoryName = category.name || 'MISC'
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
        return formats.catalogItem(catalogItem)
      }
    },
    onModalClose() {
      this.modal = false
      this.$store.dispatch('setStateValue', {
        key: 'eventEditing',
        value: null
      })
    },
    onReserve(ci) {
      if (!ci) return //todo: handle
      if (ci.status !== 'enabled') {
        this.$store.dispatch('setStateValue', {
          key: 'snackbarData',
          value: {
            status: 'error',
            statusText: 'Notice',
            message: `${ci.status.toUpperCase()} items can't be reserved.`
          }
        })
        if (ci.notes && ci.notes.length > 0) this.onShowNotes(ci)

        this.$store.dispatch('toggleStateValue', 'snackbarState')
        return
      }

      let eventData = { allDay: true }

      if (ci.isAvailable) {
        eventData.ciData = { ...ci }
        this.modalComp = 'eventEdit'
        this.$store.dispatch('setStateValue', {
          key: 'eventEditing',
          value: eventData
        })
      } else {
        this.modalComp = 'eventDetails'
        const temp = {
          event: formats.eventDetailed(
            ci.lastReservation,
            this.catalogItems,
            this.patrons
          )
        }
        this.modalCompData = { event: formats.eventPreview(temp) }
      }
      setTimeout(() => (this.modal = true), 19)
    },
    onShowImage(ciImage) {
      this.$store.dispatch('setStateValue', {
        key: 'imagePreviewData',
        value: ciImage
      })
      this.$store.dispatch('toggleModalImageFullPreview')
    },
    onShowNotes(ci) {
      this.modalCompData = {
        catalogItem: ci,
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
          items: this.orderBy(formats.noteListSimple(ci.notes), 'date_created'),
          height: 400
        }
      }
      this.modalComp = 'ciNotes'
      this.modal = true
    },
    onShowReservations(ci) {
      this.modalCompData = {
        catalogItem: ci,
        tableData: {
          headers: [
            {
              value: 'patron',
              text: 'PATRON'
            },
            {
              value: 'startDate',
              text: 'START'
            },
            {
              value: 'endDate',
              text: 'END'
            }
          ],
          items: this.orderBy(
            formats.eventListSimple(
              this.events.filter(e => e.item_id == ci.id),
              this.patrons
            ),
            'startTime',
            -1
          ),
          height: 400
        }
      }
      this.modalComp = 'ciReservations'
      this.modal = true
    }
  }
}
</script>

<style scoped>
>>> .v-toolbar {
  z-index: 9;
}
>>> .v-expansion-panel {
  max-width: 99%;
}

.v-expansion-panels--popout > .v-expansion-panel {
  max-width: 99%;
}

.flip-list-move {
  transition: transform 1s;
}
</style>
