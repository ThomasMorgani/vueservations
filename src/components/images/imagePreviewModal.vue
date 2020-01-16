<template>
  <v-card @click.left="onLeftClick" class="d-flex align-center justify-center">
    <img :src="image.src" class="image" />
    <!-- <v-img contain :src="image.src" max-height="500px"></v-img> -->
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      image: state => state.imagePreviewData
    })
  },
  methods: {
    onLeftClick() {
      this.$store.dispatch('toggleModalImageFullPreview')
    }
  }
}
</script>

<style scoped>
.image {
  max-height: 500px;
}
</style>
