<template>
  <v-card tile>
    <v-card-title class="justify-center error--text title">
      CONFIRM DELETE
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center align-center">
      <p>Confirm deletion of:</p>
      <p class="font-weight-bold">
        {{ `${field.name}` }}
      </p>
      <v-sheet
        v-if="affectedItems.items && affectedItems.items.length > 0"
        color="transparent"
        width="100%"
      >
        <p class="text-center mt-4">
          This field will be removed from the following items:
        </p>
        <eventTableSimple v-bind="affectedItems"></eventTableSimple>
      </v-sheet>
      <p class="text-center" v-else>
        (There are no items associated with this field)
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
            action: 'deleteConfirm',
            item: field
          })
        "
        >CONFIRM</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'cfDelete',
  components: {
    eventTableSimple: () => import('@/components/global/tableSimple')
  },
  props: {
    field: {
      type: Object,
      required: true
    },
    affectedItems: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
}
</script>

<style></style>
