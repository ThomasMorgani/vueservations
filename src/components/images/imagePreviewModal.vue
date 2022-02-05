<template>
  <v-card max-height="90vh" max-width="90vw" @click="onLeftClick">
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
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      image: state => state.imagePreviewData
    }),
    imageScaled() {
      return false
    }
  },
  methods: {
    onLeftClick() {
      this.$store.dispatch('toggleModalImageFullPreview')
    }
  }
}
</script>

<style scoped></style>
