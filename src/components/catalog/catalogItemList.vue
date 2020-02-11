<template>
  <!-- <v-card flat color="background"> -->
  <v-card flat>
    <v-card-title class="d-flex space-between align-center">
      <!-- <v-card-title class="pa-0"> -->
      <span class="headline font-weight-medium primary--text">CATALOG</span>
      <v-spacer></v-spacer>
      <v-icon left color="primary">mdi-filter</v-icon
      >{{ `${itemList.length} of ${catalogItems.length}` }}
    </v-card-title>
    <v-card-text>
      <v-expansion-panels
        popout
        v-model="panel"
        class="py-1"
        style="height: 65vh; overflow-y: scroll;"
      >
        <!-- <template v-for="(item, key) in limitBy(itemsDisplayed, itemDisplayLimit)"> -->
        <template v-for="(item, key) in orderBy(itemList, 'name')">
          <catalogItem
            :key="item.id ? item.id : key + 'ci'"
            :item="formatsareCatalogItemData(item)"
            :statusData="statusData"
          ></catalogItem>
          <!-- <catalogItem :key="item.id" :item="item" :isActivePanel="key === panel"></catalogItem> -->
        </template>
      </v-expansion-panels>
    </v-card-text>
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
    catalogItem
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
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
      filterCategorySelect: state => state.filterCategorySelect
    }),
    itemList() {
      return this.$store.getters.catalogItemsDisplayed
    }
  },
  methods: {
    formatsareCatalogItemData(catalogItem) {
      //format data to be passed to list item
      if (catalogItem && catalogItem.name) {
        const category = filters.categoryById(
          catalogItem.category,
          this.categories
        )
        catalogItem.categoryName = category.name || 'MISC'
        // catalogItem.customFields = cata

        return formats.catalogItem(catalogItem)
      } else {
        console.log('no cat')
        return formats.catalogItem(catalogItem)
      }
    }
  },
  created() {
    console.log(this)
  },
  mounted() {
    // console.log(this.$parent.$el)
  }
}
</script>

<style></style>
