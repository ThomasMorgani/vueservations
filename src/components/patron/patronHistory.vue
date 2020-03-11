<template>
  <v-card>
    <v-card-title class="title justify-center primary--text">
      PATRON HISTORY
    </v-card-title>
    <v-card-title class="title primary--text pt-0">
      <v-avatar color="secondary" size="30" class="mr-2">
        <v-icon color="primary">mdi-account</v-icon>
      </v-avatar>
      {{ `${patron.last_name}, ${patron.first_name}` }}
    </v-card-title>
    <v-card-text>
      <tableSimple v-bind="tableData"></tableSimple>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('cancel')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import tableSimple from '@/components/global/tableSimple'
export default {
  name: 'patronHistory',
  props: {
    tableData: {
      type: Object,
      required: true
    },
    patron: {
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
