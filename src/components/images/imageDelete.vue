<template>
  <v-card>
    <v-card-title class="justify-center error--text title">
      CONFIRM DELETE
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center align-center">
      <p>Confirm deletion of:</p>
      IMAGE
      <v-row v-if="affectedItems.items && affectedItems.items.length > 0">
        <v-col cols="12">
          <p class="text-center mt-4">
            The default image will be set on the following catalog items:
          </p>
        </v-col>
        <eventTableSimple v-bind="affectedItems"></eventTableSimple>
      </v-row>
      <p class="text-center" v-else>
        (There are no catalog items associated with this image.)
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="primary" @click="$emit('closeDelete')">CANCEL</v-btn>
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
  name: 'imageDelete',
  components: {
    eventTableSimple: () => import('@/components/global/tableSimple')
  },
  props: {
    image: {
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
