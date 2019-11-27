<template>
  <v-card>
    <v-card-title>
      <span class="title primary--text">CATALOG</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels
        popout
        v-model="panel"
        class="py-1"
        style="height: 65vh; overflow-y: scroll;"
      >
        <!-- <template v-for="(item, key) in limitBy(itemsDisplayed, itemDisplayLimit)"> -->
        <template v-for="(item, key) in itemList">
          <catalogItem
            :key="item.id"
            :item="prepareCatalogItemData(item)"
            :isActivePanel="key === panel"
          ></catalogItem>
          <!-- <catalogItem :key="item.id" :item="item" :isActivePanel="key === panel"></catalogItem> -->
        </template>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
import Vue2Filters from 'vue2-filters';
import filters from '@/modules/filters';
import prep from '@/modules/prep';

import catalogItem from '@/components/catalog/catalogItem';
export default {
  name: 'catalogList',
  components: {
    catalogItem
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    panel: null
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      categories: state => state.categories,
      filterCategorySelect: state => state.filterCategorySelect
    }),
    itemList() {
      return this.$store.getters.catalogItemsDisplayed;
    }
  },
  methods: {
    prepareCatalogItemData(catalogItem) {
      //format data to be passed to list item
      if (catalogItem && catalogItem.name) {
        const category = filters.categoryById(
          catalogItem.category,
          this.categories
        );
        catalogItem.categoryName = category.name || 'MISC';
        return prep[category.name](catalogItem);
      } else {
        console.log('no cat');
        return prep.default(catalogItem);
      }
    }
  }
};
</script>

<style></style>
