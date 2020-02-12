<template>
  <v-row class="d-flex flex-row">
    <v-col class="pt-0 pa-0 flex-grow-0 flex-shrink-1">
      <categoryList></categoryList>
    </v-col>
    <v-col class="pt-0 pa-0 flex-grow-1 flex-shrink-0">
      <catalogItemList></catalogItemList>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import categoryList from '@/components/catalog/categoryList';
import catalogItemList from '@/components/catalog/catalogItemList';
export default {
  components: {
    categoryList,
    catalogItemList
  },
  computed: {
    ...mapState({})
  }
};
</script>

<style></style>
