<template>
  <v-card>
    <v-card-title primary-title>
      <h4>EVENT DETAILS</h4>
    </v-card-title>
    <v-card-text> </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'eventDetails'
}
</script>

<style></style>
