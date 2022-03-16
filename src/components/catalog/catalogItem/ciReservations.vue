<template>
  <v-card tile>
    <modal-title text="RESERVATION HISTORY"></modal-title>
    <v-card-text>
      <ci-heading :item="catalogItem" class="pl-8 py-4"></ci-heading>
      <eventTableSimple
        :catalogItem="catalogItem"
        :tableData="tableData"
      ></eventTableSimple>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ciHeading from '@/components/catalog/catalogItem/ciHeading.vue'
import eventTableSimple from '@/components/calendar/eventTableSimple'
export default {
  name: 'ciReservations',
  components: {
    ciHeading,
    eventTableSimple
  },
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
  computed: {}
}
</script>

<style></style>
