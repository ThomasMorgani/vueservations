<template>
  <v-card>
    <v-card-title class="justify-center error--text title">
      CONFIRM DELETE
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center align-center">
      <p>Are you sure you want to delete:</p>
      <p class="font-weight-bold">
        {{ `${patron.last_name}, ${patron.first_name}` }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="primary" @click="$emit('cancel')">CANCEL</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="error"
        @click="
          $emit('actionBtn', {
            action: 'deleteConfirm'
          })
        "
        >CONFIRM</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'patronDelete',
  props: {
    patron: {
      type: Object,
      required: true
    },
    events: {
      type: Array,
      required: false,
      default: () => []
    }
  }
}
</script>

<style></style>
