<template>
  <v-card @click="onLeftClick">
    <v-img
      ref="imageDisplayed"
      :src="image.src"
      contain
      max-height="90vh"
      max-width="90vw"
    ></v-img>
    <v-card-actions v-if="imageScaled">
      actions!
    </v-card-actions>
  </v-card>
  <!-- <v-img contain :src="image.src" max-height="500px"></v-img> -->
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageScaled() {
      return false
    }
  },
  methods: {
    onLeftClick() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped></style>
