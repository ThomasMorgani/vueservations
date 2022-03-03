<template>
  <v-card>
    <v-card-title primary-title> </v-card-title>
    <v-card-text> </v-card-text>
    <v-card-actions>
      <v-btn text color="primary">text</v-btn>
      <v-btn text color="primary">text</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>
