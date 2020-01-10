<template>
    <v-card>
    <v-card-title class="justify-center title primary--text">
      EDIT IMAGE
    </v-card-title>
    <v-card-text class="modalBody">
       <v-row  class="display-flex">
          <v-col cols="6" class="display-flex">
            <p class="primary--text mb-4">
              Preview
            </p>
             <v-img :src="imageUrl ? imageUrl : currentImage" max-width="150" ref="imagePreview"></v-img>
          </v-col>
          <v-col  cols="6" class="d-flex flex-column justify-start">
                <p class="primary--text mb-4">
              Details
               <!-- TODO: v-for -->
            </p>
            <p v-for="name in Object.keys(imagePreviewProperties)" :key="name" class="mb-2">
              <span  class="primary--text font-weight-bold">{{name.toUpperCase()}}: </span>
              <span>{{imagePreviewProperties[name]}}</span>
            </p>
          </v-col>
            <v-col cols="12">
            <p class="primary--text">
              Change
            </p>
            </v-col>
            <v-col cols="12" class="options d-flex justify-space-around">
            <v-btn  cols="6" color="primary" dark :outlined="method !== 'select'" @click="method = method === 'select' ? null : 'select'"><v-icon small left>mdi-image-multiple</v-icon> SELECT EXISITING</v-btn>
            <v-btn  cols="6" color="primary" dark :outlined="method !== 'upload'" @click="method = method === 'upload' ? null : 'upload'"><v-icon small left>mdi-file-upload</v-icon> UPLOAD NEW</v-btn>
            </v-col>
       </v-row>
    </v-card-text>


  <v-expand-transition>
      <v-card flat v-show="method !== null">
        <v-card-text v-if="method === 'select'">

        </v-card-text>
        <v-card-text v-if="method === 'upload'">
          <v-file-input v-model="fileUpload" accept="image/*" label="Select Image" ref="fileInput" @change="fileInputChanged"></v-file-input>
        </v-card-text>


      </v-card>
    </v-expand-transition>
    <v-card-actions>
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
            >SAVE</v-btn>
          </div>
        </template>
        <span>{{ saveDisabledText }}</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'CIEditImage',
  input: null,
  image: null,
  props: {
    currentImage: {
      type: String,
      required: true
    }
  },
  data:() => ({
    fileUpload: null,
    imageDisplayed: null,
    imageUrl: null,
    imageFile: null,
    isLoaded: false,
    method: null,
    loading: false,
    saveDisabled: false,
    saveDisabledText: 'todo'

  }),
  computed: {
    imagePreviewProperties() {
      let loaded = this.isLoaded
      let properties = {
        name: '',
        type: '',
        dimensions: '',
        size: ''
      }
      if (loaded) {
        let img = this.$refs.imagePreview.image || []
        console.log(this.$refs)
        console.log(img)
        console.log(performance.getEntriesByName(img.src))
        properties = {
          name:  img.src ? img.src.replace(/^.*[\\/]/, '') : 'not found',
          type: img.src ? img.src.substring(img.src.length -3).toUpperCase()  : 'not found',
          dimensions: img.naturalWidth && img.naturalHeight ? `${img.naturalWidth}px X ${img.naturalHeight}px` : 'unk',
          size: 'to be added'
       }
      }
      return properties
    }
  },
  methods: {
    close() {
      this.$emit('closeImageModal')
    },
    async fileInputChanged(e) {
      console.log(e)
      if (e) {
        const fr = new FileReader();
        fr.readAsDataURL(e);
        await fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = e; // this is an image file that can be sent to server...
          console.log(this.$refs.imagePreview)
        })
      } else {
        this.imageUrl = null
        this.imageFile = null
      }
    },
    saveImage() {
      console.log('saveimage')

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
.modalBody {
  max-height: 90vh;
  overflow-y: auto;
}

.options  .v-btn {
  width: 45%;
}
</style>