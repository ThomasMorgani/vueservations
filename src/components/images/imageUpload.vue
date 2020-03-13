<template>
  <v-card height="400">
    <v-card-text class="d-flex flex-column justify-space-between pa-4">
      <v-card flat class="align-center">
        <v-img
          contain
          height="100%"
          max-height="250"
          :src="
            imageUrl ||
              'https://eipl.org/reservations/images/uploads/458d8cab268259a7e676eadc42ec2c6d.gif'
          "
        ></v-img>
      </v-card>
      <v-file-input
        v-model="fileUpload"
        accept="image/*"
        label="Select Image"
        ref="fileInput"
        @change="fileInputChanged"
        class="d-flex flex-shrink-1"
      ></v-file-input>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="cancelUpload">CANCEL</v-btn>
      <v-btn
        text
        small
        color="primary"
        :disabled="uploadDisabled"
        :loading="loading === 'loading'"
        @click="uploadImage"
        >UPLOAD</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    fileUpload: null,
    imageUrl: null,
    loading: null
  }),
  computed: {
    uploadDisabled() {
      return this.fileUpload === null
    }
  },
  methods: {
    cancelUpload() {
      this.$emit('closeUploadModal')
    },
    async fileInputChanged(e) {
      //console.log(e)
      if (e) {
        const fr = new FileReader()
        fr.readAsDataURL(e)
        await fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          // this.imageFile = e // this is an image file that can be sent to server...
          // //console.log(this.$refs.imagePreview)
        })
      } else {
        this.imageUrl = null
        this.imageFile = null
      }
    },
    resetForm() {
      this.fileUpload = null
      this.loading = null
    },
    uploadImage() {
      this.loading = 'upload'
      let pData = new FormData()
      //console.log(this.fileUpload)
      pData.append('img', this.fileUpload)
      this.$store
        .dispatch('apiPost', { endpoint: '/images_upload', postData: pData })
        .then(resp => {
          //console.log(resp)
          if (resp.status === 'success') {
            this.$emit('uploadSuccess', resp.data)
            this.resetForm()
          } else {
            console.log('ERR: ', resp)
          }
          // this.$emit('updateImage')
        })
        .catch(err => {
          console.log('err:', err)
        })
    }
  }
}
</script>

<style></style>
