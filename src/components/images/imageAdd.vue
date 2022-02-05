<template>
  <v-card>
    <v-card-title class="justify-center title primary--text outlined">
      <ModalTitleText text="ADD IMAGE"></ModalTitleText>
      {{
    }}</v-card-title>
    <v-card-text class="d-flex flex-column justify-space-between align-center">
      <v-img
        contain
        height="100%"
        max-height="250"
        ref="imgPreview"
        :src="imageDisplayed"
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
        prepend-inner-icon="mdi-link"
        outlined
        label="Image Url"
        ref="imageUrl"
        class="inputWidth mt-4"
      ></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text small color="warning" @click="cancelUpload">CANCEL</v-btn>
      <v-btn
        text
        small
        color="primary"
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
