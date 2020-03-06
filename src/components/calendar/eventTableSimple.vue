<template>
  <v-card>
    <v-card-title class="title justify-center primary--text">
      RESERVATION HISTORY
    </v-card-title>
    <v-card-title class="title primary--text pt-0">
      {{ catalogItem.name }}
      <v-chip
        label
        small
        :color="catalogItem.color ? catalogItem.color : 'grey'"
        v-text="catalogItem.abbreviation"
        class="font-weight-bold white--text mx-2"
      ></v-chip>
    </v-card-title>
    <v-card-text>
      <tableSimple v-bind="tableData"></tableSimple>
    </v-card-text>
  </v-card>
</template>

<script>
import tableSimple from '@/components/global/tableSimple'
export default {
  name: 'eventTableSimple',
  props: {
    tableData: {
      type: Object,
      required: true
    },
    catalogItem: {
      type: Object,
      required: true
    }
  },
  components: {
    tableSimple
  }
}
</script>

<style></style>
