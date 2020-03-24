<template>
  <v-card>
    <imageDetails
      :imageData="imageFile ? imageFile : currentImageData"
    ></imageDetails>
    <v-expand-transition>
      <v-card flat v-show="method !== null" class="expansionCard pa-5">
        <v-card-text v-if="method === 'select'" class="pt-0">
          <imageGallery
            :images="images"
            :showAdd="true"
            @imageClicked="selectImage"
            @newImage="modalNewImage = true"
            @newImageAdded="selectImage"
            @showPreview="showPreview"
          ></imageGallery>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-card-actions>
      <v-btn cols="6" color="primary" dark text @click="showGallery">
        <v-icon small left>{{
          method !== 'select' ? 'mdi-image-multiple' : 'mdi-chevron-up'
        }}</v-icon
        >{{ method !== 'select' ? 'CHANGE IMAGE' : 'CLOSE' }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="close">CANCEL</v-btn>
      <v-tooltip top :disabled="!saveDisabled">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              small
              color="primary"
              :disabled="saveDisabled"
              :loading="loading === 'save'"
              @click="saveImage"
              >SAVE</v-btn
            >
          </div>
        </template>
        <span>{{ saveDisabledText }}</span>
      </v-tooltip>
    </v-card-actions>
    <v-dialog
      v-model="modalNewImage"
      persistent
      transition="dialog-transition"
      :key="'m' + modalNewImage"
      max-width="800"
    >
      <imageUplaod
        @closeModal="modalNewImage = false"
        @imageAdded="onImageAdded"
      ></imageUplaod>
    </v-dialog>
  </v-card>
</template>

<script>
import imageDetails from '@/components/images/imageDetails'
import imageGallery from '@/components/images/imagesTiles'

export default {
  name: 'CIEditImage',
  components: {
    imageDetails,
    imageGallery,
    imageUplaod: () => import('@/components/images/imageUpload')
  },
  props: {
    originalImageData: {
      type: Object,
      required: true
    },
    isNew: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    defaultImageData: {
      file_path: '/reservations/images/default/',
      file_name: 'catalogitem.png',
      file_type: 'PNG'
    },
    images: null,
    imageDisplayed: null,
    imageUrl: null,
    imageFile: null,
    isLoaded: false,
    loading: false,
    method: null,
    modalNewImage: false,
    modalFullImagePreview: false,
    saveDisabled: false,
    saveDisabledText: 'todo',
    selectedImageData: {}
  }),
  computed: {
    currentImageData() {
      return Object.keys(this.selectedImageData).length > 0
        ? this.selectedImageData
        : this.originalImageData
    },
    image() {
      if (this.imageFile) {
        return this.imageUrl
      } else {
        return `${this.$apiSettings.fqdn}${this.currentImageData.file_path ||
          this.defaultImageData.file_path}${this.currentImageData.file_name ||
          this.defaultImageData.file_name}`
      }
    },
    imagePreviewProperties() {
      let loaded = this.isLoaded
      let properties = {}
      if (loaded) {
        if (this.imageFile) {
          let imgRef = this.$refs.imagePreview.image
          properties = {
            name: this.imageFile.name || 'TBD',
            // type: img.type ? img.type.substring(img.type.length -3).toUpperCase()  : 'TBD',
            type: this.imageFile.type || 'TBD',
            dimensions:
              imgRef.naturalWidth && imgRef.naturalHeight
                ? `${imgRef.naturalWidth}x${imgRef.naturalHeight}`
                : 'unk',
            size: this.imageFile.size
              ? `${Math.round(this.imageFile.size / 1024)}KB`
              : 'TBD',
            path: 'TBD'
          }
        } else {
          properties = {
            name: this.currentImageData.file_name || ' -',
            type: this.currentImageData.file_type || ' -',
            // dimensions: this.currentImageData.naturalWidth && this.currentImageData.naturalHeight ? `${this.currentImageData.naturalWidth}px X ${this.currentImageData.naturalHeight}px` : 'unk',
            dimensions:
              this.currentImageData.height && this.currentImageData.width
                ? `${this.currentImageData.width}x${this.currentImageData.height}`
                : ' unk',
            size: this.currentImageData.file_size
              ? `${this.currentImageData.file_size}KB`
              : ' -',
            path: this.currentImageData.file_path || ' -'
          }
          // properties = {
          //   name:  img.src ? img.src.replace(/^.*[\\/]/, '') : 'not found',
          //   type: img.src ? img.src.substring(img.src.length -3).toUpperCase()  : 'not found',
          //   // dimensions: img.naturalWidth && img.naturalHeight ? `${img.naturalWidth}px X ${img.naturalHeight}px` : 'unk',
          //   dimensions: img.naturalWidth && img.naturalHeight ? `${img.naturalWidth}x${img.naturalHeight}` : 'unk',
          //   size: 'TBD'
          // }
        }
      }
      return properties
    }
  },
  methods: {
    close() {
      this.$emit('closeImageModal')
    },
    getImages() {
      //console.log('get images')
      this.$store
        .dispatch('apiCall', { endpoint: '/images_get_all' })
        .then(resp => {
          this.images = resp
          //console.log('images received')
        })
        .catch(err => {
          console.log('err:', err)
        })
    },
    onImageAdded(image) {
      console.log('imageAdded')
      console.log(image)
      this.images.push(image)
      this.selectedImageData = image
      this.modalNewImage = false
    },
    reset() {
      this.imageFile = null
      this.imageUrl = null
      this.loading = false
      this.method = null
    },
    async showGallery() {
      if (this.method !== 'select') {
        if (!this.images) {
          await this.getImages()
        }
        this.method = 'select'
      } else {
        this.method = null
      }
    },
    saveImage() {
      this.loading = 'save'
      //console.log('saveimage')
      //emit save image
      this.$emit('updateImage', { ...this.currentImageData, src: this.image })
      this.reset()
      this.close()
      // this.$store.dispatch('toggle')
    },
    selectImage(image) {
      this.selectedImageData = image
    },
    showPreview(image) {
      this.$store.dispatch('setStateValue', {
        key: 'imagePreviewData',
        value: {
          src: image
        }
      })
      this.$store.dispatch('toggleModalImageFullPreview')
    }
  },
  mounted() {
    setTimeout(() => {
      this.isLoaded = true
    }, 1000)
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0px !important;
}

.expansionCard {
  height: 30vh;
  overflow-y: auto;
}

.modalBody {
  max-height: 85vh;
  overflow-y: auto;
}

.options .v-btn {
  width: 45%;
}
</style>
