<template>
  <v-card class="card">
    <v-card-title class="justify-center error--text title">
      CONFIRM DELETE
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-center align-center">
      <p>Confirm deletion of image:</p>
      <span class="font-weight-bold"> {{ image.display_name }}</span>
      <v-row
        align="start"
        justify="center"
        v-if="affectedItems.items && affectedItems.items.length > 0"
      >
        <v-col cols="12">
          <p class="text-center mt-4">
            The default image will be set on the following catalog items:
          </p>
        </v-col>
        <v-col cols="5">
          <v-img contain :src="defaultImage.src" max-height="100"></v-img>
        </v-col>
        <v-col cols="5">
          <eventTableSimple v-bind="affectedItems"></eventTableSimple>
        </v-col>
      </v-row>
      <p class="text-center" v-else>
        (There are no catalog items associated with this image.)
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="warning" @click="$emit('closeDelete')">CANCEL</v-btn>
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
    defaultImage: {
      type: Object,
      required: true
    },
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

<style scoped>
.card {
  overflow-x: hidden;
}
</style>
