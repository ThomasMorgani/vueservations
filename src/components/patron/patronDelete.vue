<template>
  <v-card>
    <v-card-title class="justify-center error--text title">
      CONFIRM DELETE
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center align-center">
      <p>Confirm deletion of:</p>
      <p class="font-weight-bold">
        {{ `${patron.last_name}, ${patron.first_name}` }}
      </p>
      <v-sheet
        v-if="affectedEvents.items && affectedEvents.items.length > 0"
        width="100%"
      >
        <p class="text-center mt-4">
          The following reservations for this patron will be removed.
        </p>
        <eventTableSimple v-bind="affectedEvents"></eventTableSimple>
      </v-sheet>
      <p class="text-center" v-else>
        (There are no events associated with this patron)
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
  components: {
    eventTableSimple: () => import('@/components/global/tableSimple')
  },
  props: {
    patron: {
      type: Object,
      required: true
    },
    affectedEvents: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>

<style></style>
