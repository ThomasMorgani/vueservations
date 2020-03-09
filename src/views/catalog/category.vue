<template>
  <v-row justify="center">
    <v-col cols="11" md="9" lg="6" xl="5">
      <categoryList></categoryList>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import categoryList from '@/components/catalog/category/categoryList'
export default {
  components: {
    categoryList
  },
  computed: {
    ...mapState({
      categories: state => state.eventsFilterCategories,
      filterCategorySelect: state => state.filterCategorySelect
    })
  }
}
</script>

<style></style>
