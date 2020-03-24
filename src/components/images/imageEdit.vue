<template>
  <v-card>
    <imageDetails :imageData="imageData"></imageDetails>
    <v-card-actions>
      <btnWithTooltip
        :btnClass="['mx-2']"
        :btnProps="{ color: 'error', text: true, disabled: isDefaultImage }"
        btnText="DELETE"
        btnTextSide="right"
        :iconProps="{
          icon: 'mdi-trash-can',
          color: 'error',
          small: true,
          left: true
        }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="
          isDefaultImage ? 'Default image cant\'t be deleted' : 'Delete Image'
        "
        @click="imageDeletePrompt"
      ></btnWithTooltip>
      <v-spacer></v-spacer>
      <btnWithTooltip
        :btnClass="['mx-2']"
        :btnProps="{ color: 'warning', text: true }"
        btnText="EDIT"
        btnTextSide="right"
        :iconProps="{
          icon: 'mdi-square-edit-outline',
          color: 'warning',
          small: true,
          left: true
        }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Edit Image Properties'"
        @click="imageEdit(imageData)"
      ></btnWithTooltip>
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
          <v-switch
            :input-value="isDefaultImage"
            disabled
            label="Default Image"
          ></v-switch>
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
      width="unset"
      max-width="800px"
      transition="dialog-transition"
    >
      <imageDelete
        v-bind="imageDeleteData"
        @closeDelete="modalDelete = false"
        @actionBtn="onDeleteConfirm"
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
    defaultImage: {
      type: Object,
      required: true
    },
    imageData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    imageDeleteData: null,
    imageRename: null,
    isLoadingDelete: false,
    modalEdit: false,
    modalDelete: false,
    imageEditSaveLoading: false
  }),
  computed: {
    imageEditSaveDisabled() {
      return (
        !this.imageRename || this.imageData.display_name == this.imageRename
      )
    },
    isDefaultImage() {
      return this.defaultImage.id === this.imageData.id
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
              width: 50
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
        },
        defaultImage: this.defaultImage
      }
      this.modalDelete = true
    },
    imageEdit(image) {
      this.imageRename = image.display_name || null
      this.modalEdit = true
    },
    onDeleteConfirm() {
      this.isLoadingDelete = true
      this.$store
        .dispatch('apiCall', {
          endpoint: '/image_delete/' + this.imageData.id
        })
        .then(resp => {
          if (resp.status === 'success') {
            this.modalDelete = false
            this.modalEdit = false
            if (this.imageDeleteData.affectedItems.items.length > 0) {
              this.updateCatalogItems()
            }
            this.$emit('imageDeleted', this.imageData)
          } else {
            this.isLoadingDelete = false
          }
        })
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
    updateCatalogItems() {
      const items = this.$store.state.catalogItems.map(ci => {
        return ci.image === this.imageDeleteData.image.id
          ? {
              ...ci,
              image: this.defaultImage.id,
              image_data: this.defaultImage
            }
          : ci
      })
      this.$store.dispatch('setStateValue', {
        key: 'catalogItems',
        value: items
      })
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
