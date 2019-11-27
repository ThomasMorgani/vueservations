<template>
  <v-row justify="center">
    <v-col cols="4">
      <categoryList></categoryList>
    </v-col>
    <v-col cols="7">
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
