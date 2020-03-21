<template>
  <v-card>
    <v-card-title
      class="font-weight-bold primary--text headline justify-space-between"
    >
      <span>{{
        imageData.display_name ? imageData.display_name : 'Name Here'
      }}</span>
      <v-btn flat icon color="warning">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row align="center">
        <v-col cols="6">
          <v-img contain :src="imageData.src"></v-img>
        </v-col>
        <v-col
          cols="6"
          class="d-flex-column flex-wrap align-start justify-start"
        >
          <v-list dense>
            <v-list-item v-for="detail in imageDetails" :key="detail.text">
              <v-list-item-content>
                <v-list-item-title class="subtitle-2"
                  >{{ detail.text }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ detail.value }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <!-- <p v-for="name in Object.keys(imageData)" :key="name" class="mb-0">
            <span class="primary--text font-weight-bold"
              >{{ name.toUpperCase() }}:</span
            >
            <span>{{ imageData[name] }}</span>
          </p> -->
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'imageDetails',
  props: {
    imageData: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageDetails() {
      return [
        {
          text: 'File name',
          value: this.imageData.file_name || '-'
        },
        {
          text: 'Type',
          value: this.imageData.file_type || '-'
        },
        {
          text: 'Size',
          value: this.imageData.file_size
            ? this.imageData.file_size + ' KB'
            : '-'
        },
        {
          text: 'Height',
          value: this.imageData.height ? this.imageData.height + ' PX' : '-'
        },
        {
          text: 'Width',
          value: this.imageData.width ? this.imageData.width + ' PX' : '-'
        },
        {
          text: 'Upload Date',
          value: this.imageData.date_added || '-'
        }
      ]
    }
  }
}
</script>
