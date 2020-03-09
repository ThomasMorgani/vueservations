<template>
  <v-card>
    <v-card-title class="justify-center title primary--text"
      >EDIT IMAGE</v-card-title
    >
    <v-card-text class="modalBody pb-0">
      <v-row class="d-flex align-center justify-center">
        <v-col class="d-flex align-center justify-center flex-shrink-1">
          <v-img
            :src="image"
            max-width="200"
            ref="imagePreview"
            @click="showPreview"
          ></v-img>
        </v-col>
        <v-col class="d-flex flex-column justify-start flex-grow-1">
          <p class="primary--text mb-4">
            Details
            <!-- TODO: v-for -->
          </p>
          <p
            v-for="name in Object.keys(imagePreviewProperties)"
            :key="name"
            class="mb-2"
          >
            <span class="primary--text font-weight-bold"
              >{{ name.toUpperCase() }}:</span
            >
            <span>{{ imagePreviewProperties[name] }}</span>
          </p>
        </v-col>
        <!-- <v-col cols="12">
          <p class="primary--text">Change</p>
        </v-col>
        <v-col cols="12" class="options d-flex justify-space-around">
          <v-btn
            cols="6"
            color="primary"
            dark
            :outlined="method !== 'select'"
            @click="method = method === 'select' ? null : 'select'"
          >
            <v-icon small left>mdi-image-multiple</v-icon>SELECT
            EXISITING
          </v-btn>
          <v-btn
            cols="6"
            color="primary"
            dark
            :outlined="method !== 'upload'"
            @click="method = method === 'upload' ? null : 'upload'"
          >
            <v-icon small left>mdi-file-upload</v-icon>UPLOAD NEW
          </v-btn>
        </v-col>-->
      </v-row>
    </v-card-text>
    <v-expand-transition>
      <v-card flat v-show="method !== null" class="expansionCard">
        <v-card-text v-if="method === 'select'" class="pt-0">
          <imageGallery
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
        :outlined="method !== 'select'"
        @click="method = method === 'select' ? null : 'select'"
      >
        <v-icon small left>mdi-image-multiple</v-icon>CHANGE IMAGE
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
import imageGallery from '@/components/images/images'

export default {
  name: 'CIEditImage',
  components: { imageGallery },
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
      console.log('saveimage')
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
