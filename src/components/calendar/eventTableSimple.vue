<template>
  <v-card>
    <v-card-title class="title justify-center primary--text">
      {{ catalogItem.name }} RESERVATIONS
    </v-card-title>
    <v-card-text>
      <tableSimple v-bind="tableData"></tableSimple>
      <!-- <v-simple-table dense fixed-header :height="height" class="mt-4">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">START</th>
          <th class="text-left">END</th>
          <th class="text-left">PATRON</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="e in events" :key="e.id">
          <td>{{ e.startDate }}</td>
          <td>{{ e.endDate }}</td>
          <td>{{ e.patron }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table> -->
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
