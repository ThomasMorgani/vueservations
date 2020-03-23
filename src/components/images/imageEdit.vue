<template>
  <v-card>
    <imageDetails :imageData="imageData"></imageDetails>
    <v-card-actions>
      <btnWithTooltip
        :btnClass="['mx-2']"
        :btnProps="{ color: 'error', text: true }"
        btnText="DELETE"
        btnTextSide="right"
        :iconProps="{
          icon: 'mdi-trash-can',
          color: 'error',
          small: true,
          left: true
        }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Delete Image'"
        @click="imageDeletePrompt"
      ></btnWithTooltip>
      <btnWithTooltip
        :btnClass="['mx-2']"
        :btnProps="{ color: 'warning', text: true }"
        btnText="EDIT"
        btnTextSide="right"
        :iconProps="{
          icon: 'mdi-square-edit-outline',
          color: 'warning',
          small: true,
          right: true
        }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Edit Image Properties'"
        @click="imageEdit(imageData)"
      ></btnWithTooltip>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="close">CLOSE</v-btn>
    </v-card-actions>
    <!-- MERGE INTO DYNAMIC "SECONDARY MODAL -->
    <!-- <MODAL EDIT -->
    <v-dialog
      v-model="modalEdit"
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
          <v-select disabled label="Tags"></v-select>
          <v-switch disabled label="Default Image"></v-switch>
        </v-card-text>

        <v-card-actions>
          <v-btn text color="primary" @click="modalEdit = false">CANCEL</v-btn>
          <v-spacer></v-spacer>

          <v-btn
            text
            color="success"
            :disabled="imageEditSaveDisabled"
            :loading="imageEditSaveLoading"
            @click="saveImageEdit"
            ><v-icon left>mdi-content-save</v-icon>SAVE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <MODAL DELETE -->
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

import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
import imageDetails from '@/components/images/imageDetails'
import imageDelete from '@/components/images/imageDelete'

export default {
  name: 'imageEdit',
  mixins: [Vue2Filters.mixin],
  components: { btnWithTooltip, imageDetails, imageDelete },
  props: {
    imageData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    imageDeleteData: null,
    imageRename: null,
    modalEdit: false,
    modalDelete: false,
    imageEditSaveLoading: false
  }),
  computed: {
    imageEditSaveDisabled() {
      return (
        !this.imageRename || this.imageData.display_name == this.imageRename
      )
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
    imageEdit(image) {
      this.imageRename = image.display_name || null
      this.modalEdit = true
    },

    saveImageEdit() {
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
              this.$emit('imageEditSaved', {
                ...this.imageData,
                display_name: this.imageRename
              })
              this.modalEdit = false
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
