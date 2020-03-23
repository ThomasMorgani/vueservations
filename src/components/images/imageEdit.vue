<template>
  <v-card>
    <imageDetails
      :imageData="imageData"
      @imageRename="onImageRename"
    ></imageDetails>
    <v-card-actions>
      <v-btn color="error" dark text @click="imageDeletePrompt">
        <v-icon small left>mdi-trash-can</v-icon>DELETE
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="close">CLOSE</v-btn>
    </v-card-actions>
    <!-- MERGE INTO DYNAMIC "SECONDARY MODAL -->
    <!-- <MODAL RENAME -->
    <v-dialog
      v-model="modalRename"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title> </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="imageRename"
            label="Name"
            autofocus
            class="my-4"
          ></v-text-field>
          <v-card-actions>
            <v-btn text color="primary" @click="modalRename = false"
              >CANCEL</v-btn
            >
            <v-spacer></v-spacer>

            <v-btn
              text
              color="success"
              :disabled="renameSaveDisabled"
              :loading="renameSaveLoading"
              @click="saveRename"
              ><v-icon left>mdi-content-save</v-icon>SAVE</v-btn
            >
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- <MODAL RENAME -->
    <v-dialog
      v-model="modalDelete"
      max-width="500px"
      transition="dialog-transition"
    >
      <imageDelete
        v-bind="imageDeleteData"
        @closeDelete="modalDelete = false"
      ></imageDelete>
    </v-dialog>
  </v-card>
</template>

<script>
import Vue2Filters from 'vue2-filters'
import imageDetails from '@/components/images/imageDetails'
import imageDelete from '@/components/images/imageDelete'

export default {
  name: 'CIEditImage',
  mixins: [Vue2Filters.mixin],
  components: { imageDetails, imageDelete },
  props: {
    imageData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    imageDeleteData: null,
    imageRename: null,
    modalDelete: false,
    modalRename: false,
    renameSaveLoading: false
  }),
  computed: {
    renameSaveDisabled() {
      return !this.imageRename && this.imageData.name == this.imageRename
    }
  },
  methods: {
    close() {
      this.$emit('closeModal')
    },
    imageDeletePrompt() {
      this.imageDeleteData = {
        image: this.imageData,
        affectedItems: {
          headers: [
            {
              value: 'name',
              text: 'CATALOG ITEM',
              width: 200
            }
          ],
          items: this.orderBy(
            this.$store.state.catalogItems
              .filter(cI => cI.image === this.imageData.id)
              .map(i => {
                return { name: i.name }
              }),
            'name'
          ),
          height: 200
        }
      }
      this.modalDelete = true
    },
    onImageRename(image) {
      this.imageRename = image.name || null
      this.modalRename = true
    },

    saveRename() {
      if (this.imageRename) {
        this.$store
          .dispatch('apiPost', {
            endpoint: '/image_rename',
            postData: {
              id: this.imageData.id,
              display_name: this.imageRename
            }
          })
          .then(resp => {
            if (resp.status === 'success') {
              // this.updateImageName()
              this.$emit('imageRenamed', {
                ...this.imageData,
                display_name: this.imageRename
              })
              this.modalRename = false
            }
          })
          .catch(err => console.log(err))
      }
    },
    updateImageName() {
      //TODO:ageData, display_name: this.imageRename })
      //Will images be moved to state? prob not but keep for now
      // const key = this.$store.state.images.findIndex(
      //   i => i.id === this.imageData.id
      // )
      // if (key > -1) {
      //   this.$store.dispatch('setStateValueByKey', {
      //     stateItem: 'images',
      //     key: key,
      //     value: { ...this.imageData, display_name: this.imageRename }
      //   })
      // }
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
