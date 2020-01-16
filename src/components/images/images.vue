<template>
  <v-card text>
    <v-card-text class="d-flex flex-wrap align-center justify-start pt-0">
      <v-progress-circular indeterminate v-if="loading && images.length > 0"></v-progress-circular>
      <template v-else>
        <v-col cols="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-card
                hover
                height="125"
                color="primary"
                @click="modalUploadForm = true"
                v-on="on"
                class="d-flex align-center justify-center"
              >
                <v-icon large color="secondary">mdi-image-plus</v-icon>
              </v-card>
            </template>
            <span>Add Image</span>
          </v-tooltip>
        </v-col>
        <v-col cols="3" v-for="image in images" :key="image.id">
          <v-card
            hover
            height="125"
            @mouseenter="mouseOver = image.id"
            @mouseleave="mouseOver = null"
            @click="$emit('imageClicked', image)"
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
            <v-img :src="image.src" class="align-start justify-start"></v-img>
          </v-card>
        </v-col>
      </template>
    </v-card-text>
    <v-dialog
      v-model="modalUploadForm"
      scrollable
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <uploadForm @closeUploadModal="modalUploadForm = false" @uploadSuccess="addNewImage"></uploadForm>
    </v-dialog>
  </v-card>
</template>

<script>
import uploadForm from '@/components/images/imageUpload'
export default {
  components: {
    uploadForm
  },
  data: () => ({
    images: [],
    modalUploadForm: false,
    mouseOver: false,
    loading: false
  }),
  computed: {},
  methods: {
    addNewImage(e) {
      this.images.push(e)
      this.$emit('newImageAdded', e)
      this.modalUploadForm = false
    },
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
