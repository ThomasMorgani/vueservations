<template>
  <v-card>
    <v-card-text>
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
import eventTableSimple from '@/components/calendar/eventTableSimple'
export default {
  name: 'ciReservations',
  components: {
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
