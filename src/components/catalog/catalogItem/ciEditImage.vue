<template>
  <v-card>
    <imageDetails
      :imageData="imageFile ? imageFile : currentImageData"
    ></imageDetails>
    <v-expand-transition>
      <v-card flat v-show="method !== null" class="expansionCard pa-5">
        <v-card-text v-if="method === 'select'" class="pt-0">
          <imageGallery
            :showAdd="true"
            @imageClicked="selectImage"
            @newImageAdded="selectImage"
          ></imageGallery>
        </v-card-text>
      </v-card>
    </v-expand-transition>
    <v-card-actions>
      <v-btn
        cols="6"
        color="primary"
        dark
        text
        @click="method = method === 'select' ? null : 'select'"
      >
        <v-icon small left>{{
          method !== 'select' ? 'mdi-image-multiple' : 'mdi-chevron-up'
        }}</v-icon
        >{{ method !== 'select' ? 'CHANGE IMAGE' : 'CANCEL' }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="close">CLOSE</v-btn>
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
  </v-card>
</template>

<script>
import imageDetails from '@/components/images/imageDetails'
import imageGallery from '@/components/images/imagesTiles'

export default {
  name: 'CIEditImage',
  components: { imageDetails, imageGallery },
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
    imageDisplayed: null,
    imageUrl: null,
    imageFile: null,
    isLoaded: false,
    loading: false,
    method: null,
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

    reset() {
      this.imageFile = null
      this.imageUrl = null
      this.loading = false
      this.method = null
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
    showPreview() {
      this.$store.dispatch('setStateValue', {
        key: 'imagePreviewData',
        value: {
          src: this.image
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
