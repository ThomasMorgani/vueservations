<template>
  <v-row class="d-flex flex-row">
    <v-col class="pt-0 pa-0 flex-grow-1 flex-shrink-0">
      <catalogItemList></catalogItemList>
    </v-col>
    <v-col class="pt-0 pa-0 flex-grow-0 flex-shrink-1">
      <categoryList v-show="!sideDrawer"></categoryList>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import categoryList from '@/components/catalog/category/categoryList'
import catalogItemList from '@/components/catalog/catalogItem/ciList'
export default {
  components: {
    categoryList,
    catalogItemList
  },
  computed: {
    ...mapState({
      sideDrawer: 'sideDrawer'
    })
  }
}
</script>

<style></style>
