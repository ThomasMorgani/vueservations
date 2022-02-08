<template>
  <v-card>
    <modal-title text="ADD IMAGE"></modal-title>
    <v-card-text class="d-flex flex-column justify-space-between align-center">
      <p v-if="imageLoading && !imageError">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </p>
      <p v-if="!imageLoading && imageError" class="error--text">
        Error loading image
      </p>
      <v-img
        v-if="!imageLoading && !imageError"
        contain
        height="100%"
        max-height="250"
        ref="imgPreview"
        :src="imageDisplayed"
        @error="imageError = $event"
        @load="imageLoading = false"
      ></v-img>
      <v-text-field
        messages="(optional)"
        label="Image Name"
        v-model="imageName"
        class="inputWidth mt-4"
      >
      </v-text-field>
      <v-select
        v-model="imgSrcSelect"
        color="primary"
        :items="imgSrcItems"
        label="Image source"
        class="inputWidth mt-4"
      ></v-select>

      <v-file-input
        v-if="imgSrcSelect === 'upload'"
        v-model="fileUpload"
        accept="image/*"
        label="Select Image"
        ref="fileInput"
        @change="fileInputChanged"
        class="inputWidth mt-4"
      ></v-file-input>
      <v-text-field
        v-if="imgSrcSelect === 'url'"
        v-model="imageUrl"
        clearable
        prepend-inner-icon="mdi-link"
        outlined
        label="Image Url"
        ref="imageUrl"
        @input="onUrlInput"
        class="inputWidth mt-4"
      ></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-btn text color="warning" @click="cancelUpload">CANCEL</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        text
        color="success"
        :disabled="uploadDisabled"
        :loading="loading === 'loading'"
        @click="imgSrcSelect === 'url' ? saveImage() : uploadImage()"
        >{{ imgSrcSelect === 'url' ? 'SAVE' : 'UPLOAD' }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { timestampSql } from '@/modules/formats'
let inputDebounce = null
export default {
  name: 'ImageAdd',
  data: () => ({
    imgSrcItems: [
      {
        disabled: false,
        text: 'URL',
        value: 'url'
      },
      {
        disabled: true,
        text: 'UPLOAD',
        value: 'upload'
      }
    ],
    imgSrcSelect: 'url',
    fileUpload: null,
    imageError: false,
    imageLoading: false,
    imageName: '',
    imageUrl: '',
    loading: false
  }),
  computed: {
    imageDisplayed() {
      if (this.imageUrl) return this.imageUrl
      const defaultImageId = this.$store.getters.appSettingsByName.Default_Image
        .setting
      const image = this.$store.state.images.find(
        image => image.id == defaultImageId
      )
      return image?.src || ''
    },
    uploadDisabled() {
      return !this.imageUrl && this.fileUpload === null
    }
  },
  methods: {
    cancelUpload() {
      this.$emit('closeModal')
    },

    formatImage() {
      const now = new Date()
      const nowSql = timestampSql(now)
      const imageData = this.$refs.imgPreview
      const newImage = {
        date_added: nowSql,
        date_updated: nowSql,
        display_name: this.imageName,
        file_ext: '',
        file_name: '',
        file_name_orig: '',
        file_path: '',
        file_size: '',
        file_type: 'img',
        height: imageData.image.height || '',
        id: now.getTime(),
        image_hash: null,
        src: this.imageUrl,
        srcType: this.imgSrcSelect,
        width: imageData.image.width || ''
      }
      return newImage
    },
    onUrlInput() {
      this.imageError = false
      this.imageLoading = true
      if (inputDebounce) clearTimeout(inputDebounce)
      inputDebounce = setTimeout(() => {
        this.imageLoading = false
      }, 900)
    },
    saveImage() {
      const image = this.formatImage()
      this.$store.dispatch('setStateValue', {
        key: 'images',
        value: [...this.$store.state.images, image]
      })
      this.$store.dispatch('localStorageWrite', {
        key: 'images',
        data: this.$store.state.images
      })

      this.$emit('imageAdded', image)
    },
    uploadImage() {
      //not supported in demo
      return false
    }
  }
}
</script>

<style>
.inputWidth {
  min-width: 75%;
}
</style>
