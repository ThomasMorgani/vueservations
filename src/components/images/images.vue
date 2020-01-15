<template>
  <v-card text max-height="300" style="overflow-y: auto;">
    <v-card-text class="d-flex flex-wrap align-center justify-start">
      <v-progress-circular
        indeterminate=""
        v-if="loading && images.length > 0"
      ></v-progress-circular>
      <template v-else>
        <v-col cols="3">
          <v-card
            hover
            height="125"
            color="primary"
            class="d-flex align-center justify-center"
          >
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon large="" color="secondary" v-on="on"
                  >mdi-image-plus</v-icon
                >
              </template>
              <span>Add Image</span>
            </v-tooltip>
          </v-card>
        </v-col>
        <v-col cols="3" v-for="image in images" :key="image.id">
          <v-card
            hover
            height="125"
            @mouseenter="mouseOver = image.id"
            @mouseleave="mouseOver = null"
            class="d-flex align-center"
          >
            <v-btn
              v-if="mouseOver === image.id"
              fab
              absolute
              small
              color="primary"
              @click="showPreview(image)"
              class="previewIcon"
            >
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
            <v-img :src="image.src" class="align-start justify-start"> </v-img>
          </v-card>
        </v-col>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    hi: 'hi',
    images: [],
    mouseOver: false,
    loading: false
  }),
  computed: {},
  methods: {
    getImages() {
      console.log('get images')
      this.$store
        .dispatch('apiCall', { endpoint: '/images_get_all' })
        .then(resp => {
          this.images = resp
          console.log('images received')
        })
        .catch(err => {
          console.log('err:', err)
        })
    },
    showPreview(image) {
      this.$store.dispatch('setStateValue', {
        key: 'imagePreviewData',
        value: image
      })
      this.$store.dispatch('toggleModalImageFullPreview')
    }
  },
  async mounted() {
    this.loading = true
    await this.getImages()
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.previewIcon {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 5;
}
</style>
