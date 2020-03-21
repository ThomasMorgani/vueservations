<template>
  <v-card>
    <imageDetails :imageData="imageData"></imageDetails>
    <v-card-actions>
      <v-btn color="error" dark text>
        <v-icon small left>mdi-trash-can</v-icon>DELETE
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="close">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import imageDetails from '@/components/images/imageDetails'

export default {
  name: 'CIEditImage',
  components: { imageDetails },
  props: {
    imageData: {
      type: Object,
      required: true
    }
  },
  computed: {},
  methods: {
    close() {
      this.$emit('closeModal')
    }
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
