<template>
  <v-card flat>
    <v-card-text class="d-flex flex-wrap align-center justify-start pt-0">
      <v-progress-circular
        large
        indeterminate
        v-if="loading && images.length < 1"
      ></v-progress-circular>
      <template v-else>
        <v-col cols="3" v-if="showAdd">
          <v-tooltip color="primary" top>
            <template v-slot:activator="{ on }">
              <v-card
                hover
                height="125"
                color="primary"
                @click="$emit('newImage')"
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
              color="secondary"
              @click.stop="showPreview(image)"
              class="previewIcon"
            >
              <v-icon color="primary">mdi-eye</v-icon>
            </v-btn>
            <v-img
              :src="image.src"
              height="125"
              contain
              class="align-start justify-start"
            ></v-img>
          </v-card>
        </v-col>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: false,
      default: () => []
    },
    showAdd: {
      type: Boolean,
      required: false,
      default: () => false
    },
    showEdit: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data: () => ({
    modalUploadForm: false,
    mouseOver: false,
    loading: false
  }),
  computed: {},
  methods: {
    addNewImage(e) {
      this.$emit('add', e)
    },
    showPreview(image) {
      this.$emit('showPreview', image)
    }
  }
}
</script>

<style lang="scss" scoped>
.previewIcon {
  position: absolute;
  top: 0px;
  left: -20px;
  z-index: 5;
}
</style>
