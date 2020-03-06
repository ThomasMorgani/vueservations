<template>
  <v-card>
    <v-card-title class="justify-center title primary--text">
      {{ id ? 'EDIT ITEM' : 'ADD ITEM' }}
    </v-card-title>
    <v-card-text class="modalBody">
      <form>
        <v-row align="center" justify="center" dense>
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="Name"
              name="name"
              textarea
              :error-messages="nameAvailable"
            ></v-text-field>
          </v-col>

          <v-col cols="3" class="text-left">
            <v-text-field
              v-model="abbreviation"
              label="Abbreviation"
              name="abbr"
              textarea
              filled
              maxlength="4"
              :error-messages="abbreviationAvailable"
            ></v-text-field>
          </v-col>
          <v-col cols="9">
            <v-select
              v-model="category"
              :items="categories"
              item-text="name"
              item-value="id"
              label="Category"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              label="Status"
              :items="statusOptions"
              v-model="status"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <v-card outlined class="d-flex flex-column pa-2">
                  <p>Color</p>
                  <div>
                    <v-menu
                      :close-on-content-click="false"
                      :nudge-width="200"
                      offset-x
                    >
                      <template v-slot:activator="{ on }">
                        <v-avatar tile v-on="on" :color="color" hover>
                          <v-icon color="white">mdi-palette</v-icon>
                        </v-avatar>
                      </template>
                      <v-color-picker
                        v-model="color"
                        class="ma-2"
                        hide-inputs
                      ></v-color-picker>
                    </v-menu>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card outlined class="d-flex flex-column pa-2">
                  <p>Image</p>
                  <!-- <p class="mb-0"></p> -->
                  <v-img
                    :src="imageDisplayed"
                    height="48"
                    width="48"
                    hover
                    @click="modalEditImage = !modalEditImage"
                  ></v-img>
                  <!-- <v-file-input formatsend-inner-icon="mdi-image" formatsend-icon label="Select Image"></v-file-input> -->
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="description"
              label="Decription"
              auto-grow
              dense
              outlined
              rows="4"
              class="mt-2"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-card flat class="pa-2">
              <v-row justify="space-between" no-gutters>
                <v-col cols="8">
                  <span class="title primary--text">DETAILS</span>
                </v-col>
                <v-col class="text-right">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        text
                        icon
                        color="warning"
                        @click="editCustomFields"
                        v-on="on"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit details</span>
                  </v-tooltip>
                </v-col>
                <v-col cols="12">
                  <v-divider></v-divider>
                  <customFieldsList
                    :items="customFieldsDisplayed"
                  ></customFieldsList>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-tooltip top :disabled="!id">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              small
              color="error"
              :disabled="!id"
              :loading="loading === 'delete'"
              @click="deletePrompt"
              >DELETE</v-btn
            >
          </div>
        </template>
        <span>Delete catalog item</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn text small :disabled="!isChanged" @click="resetChanges"
              >RESET</v-btn
            >
          </div>
        </template>
        <span>Revert all unsaved changes</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="cancel">CLOSE</v-btn>
      <v-tooltip top :disabled="!saveDisabled && !isChanged">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              small
              color="primary"
              :disabled="saveDisabled"
              :loading="loading === 'save'"
              @click="save"
            >
              <transition name="bounce-top">
                <v-icon
                  small
                  color="warning"
                  class="mr-1"
                  v-if="isChanged && !saveDisabled"
                  >mdi-content-save-alert</v-icon
                >
              </transition>
              SAVE
            </v-btn>
          </div>
        </template>
        <span>{{ saveTooltipText }}</span>
      </v-tooltip>
    </v-card-actions>
    <!-- DIALOGS -->
    <!-- DIALOGS -->
    <!-- DIALOGS -->

    <!-- EDIT IMAGE -->
    <v-dialog
      v-model="modalEditImage"
      max-width="650px"
      transition="dialog-transition"
      :key="id + 'imgModal'"
    >
      <editImageModal
        :originalImageData="image_data"
        :isNew="Boolean(!id)"
        @closeImageModal="modalEditImage = false"
        @updateImage="updateImage"
      ></editImageModal>
    </v-dialog>

    <!-- DELETE ITEM -->
    <v-dialog
      v-model="modalConfirmDelete"
      max-width="500px"
      transition="dialog-transition"
    >
      <!--TODO: Move to Component -->
      <v-card>
        <v-card-title class="justify-center title error--text"
          >CONFIRM DELETE</v-card-title
        >
        <v-card-text>
          <v-row class="justify-center align-center">
            <v-col cols="12" class="align-center">
              <p class="font-weight-bold text-center">
                WARNING: You are about to delete catalog item:
              </p>
              <p class="font-weight-bold text-center">"{{ name }}"</p>
              <template
                v-if="affectedEventData && affectedEventData.items.length > 0"
              >
                <p class="text-center">
                  The following reservations for this item will be removed.
                </p>
                <eventTableSimple v-bind="affectedEventData"></eventTableSimple>
              </template>
              <p class="text-center" v-else>
                (There are no events associated with this item)
              </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn
            color="primary"
            text
            @click="modalConfirmDelete = !modalConfirmDelete"
            >CANCEL</v-btn
          >
          <v-btn color="error" text @click="deleteCatalogitem"
            >CONFIRM DELETE</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import customFieldsList from '@/components/catalog/catalogItemCustomFieldsList'
import * as formats from '@/modules/formats.js'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'catalogItemEdit',
  components: {
    customFieldsList,
    editImageModal: () => import('@/components/catalog/catalogItemEditImage'),
    eventTableSimple: () => import('@/components/global/tableSimple')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    abbreviation: null,
    affectedEventData: null,
    category: null,
    color: 'primary',
    customFields: [],
    defaultItem: {
      abbreviation: null,
      category: null,
      color: 'primary',
      customFields: [],
      description: null,
      id: null,
      image_data: {},
      name: null,
      status: null
    },
    description: null,
    id: null,
    image: null,
    image_data: {},
    loading: false,
    modalConfirmDelete: false,
    modalEditImage: false,
    name: null,
    originalValues: {},
    status: null,
    statusOptions: ['blocked', 'enabled', 'disabled']
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      catalogItemediting: state => state.catalogitemediting,
      categories: state => state.categories,
      events: state => state.events,
      patrons: state => state.patrons
    }),
    abbreviationAvailable() {
      const abvMatches = this.catalogItems.find(
        el =>
          el.abbreviation.toLowerCase() ===
            String(this.abbreviation).toLowerCase() && el.id !== this.id
      )
      if (!this.abbreviation) {
        return 'Abbreviation Required'
      }
      if (abvMatches !== undefined) {
        return 'Abbr. exists.'
      }
      return null
    },
    customFieldsDisplayed() {
      return this.catalogItemediting.customFields
    },
    imageDisplayed() {
      let img =
        'https://www.eipl.org/reservations/images/default/catalogitem.png'
      const baseUrl = 'https://www.eipl.org'
      // const path = 'https://www.eipl.org/reservations/images/uploads/'
      if (this.image_data.file_name) {
        // img = path + this.image_data.file_name
        img = baseUrl + this.image_data.file_path + this.image_data.file_name
      }
      return img
    },
    isChanged() {
      //TODO: FIND WHY AFTER SAVING isChanged does not reset to false
      let isChanged = false
      // let origStr = this.originalValues.toString()
      // let loadingState = this.loading
      console.log(this.originalValues)
      Object.keys(this.defaultItem).forEach(field => {
        if (field !== 'customFields' && field !== 'categoryName') {
          if (field === 'image_data') {
            if (
              this[field] &&
              this[field].id &&
              this[field].id !== this.originalValues[field].id
            ) {
              isChanged = true
            }
          } else {
            if (this.originalValues[field] !== this[field]) {
              isChanged = true
            }
          }
        }
      })
      return isChanged
    },
    fieldsRequired() {
      let fields = []
      Object.keys(this.defaultItem).forEach(field => {
        if (
          field !== 'id' &&
          field !== 'customFields' &&
          this[field] === this.defaultItem[field]
        ) {
          fields.push(field)
        }
      })
      return fields
    },
    nameAvailable() {
      const nameMatches = this.catalogItems.find(
        el =>
          el.name.toLowerCase() === String(this.name).toLowerCase() &&
          el.id !== this.id
      )
      if (!this.name) {
        return 'Name Required'
      }
      if (nameMatches !== undefined) {
        return 'Item name already exists.'
      }
      return null
    },
    saveDisabled() {
      return (
        !this.isChanged ||
        this.abbreviationAvailable !== null ||
        this.nameAvailable !== null ||
        this.fieldsRequired.length > 0
      )
    },
    saveTooltipText() {
      let text = 'Errors with form'
      if (!this.isChanged) {
        text = 'There are no unsaved changes'
      } else if (this.nameAvailable !== null) {
        text = 'Name must be unique'
      } else if (this.abbreviationAvailable !== null) {
        text = 'Abbreviation must be unique'
      } else if (this.fieldsRequired.length > 0) {
        text = 'The following fields are required:'
        for (let i in this.fieldsRequired) {
          text =
            i == this.fieldsRequired.length - 1
              ? `${text} ${this.fieldsRequired[i]}`
              : `${text} ${this.fieldsRequired[i]},`
        }
      } else if (this.isChanged) {
        text = 'Save pending changes'
      }
      return text
    }
  },
  methods: {
    cancel() {
      // this.resetForm();
      this.loading = null
      this.$store.dispatch('toggleModalCatalogitemEdit')
    },
    deleteCatalogitem() {
      console.log('delete')
      this.$store
        .dispatch('catalogitemDelete', { id: this.id })
        .then(resp => {
          console.log(resp)
          if (resp.status === 'success') {
            this.$store.dispatch('setStateValue', {
              key: 'events',
              value: this.events.filter(e => e.item_id !== this.id)
            })
            this.modalConfirmDelete = !this.modalConfirmDelete
            this.$store.dispatch('toggleModalCatalogitemEdit')
            //TODO: SNACKBAR
          }
        })
        .catch(err => {
          console.log('err: ' + err)
        })
    },
    deletePrompt() {
      let affectedEvents = this.events.filter(e => e.item_id === this.id)
      if (affectedEvents.length > 0) {
        affectedEvents = formats.eventListSimple(affectedEvents, this.patrons)
      }
      this.affectedEventData = {
        headers: [
          {
            value: 'patron',
            text: 'PATRON'
          },
          {
            value: 'startDate',
            text: 'START'
          },
          {
            value: 'endDate',
            text: 'END'
          }
        ],
        items: this.orderBy(affectedEvents, 'startDate'),
        height: 200
      }
      this.modalConfirmDelete = true
    },
    editCustomFields() {
      const customFields = this.catalogItemediting.customFields
        ? this.catalogItemediting.customFields
        : []
      this.$store
        .dispatch('catalogitemeditingcustomfieldsSetediting', customFields)
        .then(() => {
          this.$store.dispatch('toggleModalCatalogitemEditCustomfields')
        })
    },
    resetChanges() {
      let isChanged = false
      Object.keys(this.originalValues).forEach(field => {
        if (field !== 'customFields' && field !== 'categoryName') {
          this.$set(this, field, this.originalValues[field])
        }
      })
      return !isChanged
    },
    resetForm() {
      this.color = this.$vuetify.theme.primary || 'primary'
      this.id = null
      this.loading = false
      this.name = null
    },
    save() {
      this.loading = 'save'
      const itemValues = [
        'abbreviation',
        'category',
        'color',
        'id',
        'description',
        'name',
        'note',
        'status'
      ]
      let postData = {}
      itemValues.forEach(val => (postData[val] = this[val]))
      postData.image = this.image_data.id
      const isNew = !postData.id
      if (isNew) {
        //TODO: WE SHOULD BE ABLE TO WORK THIS INTO UPDATE FUNCTION ON SERVERSIDE
        postData.customFields = this.catalogItemediting.customFields
      }
      const endpoint = isNew ? '/catalogitem_create' : '/catalogitem_update'
      this.$store
        .dispatch('apiCall', {
          endpoint: endpoint,
          postData: postData
        })
        .then(resp => {
          if (resp.status === 'success') {
            if (isNew) {
              //ADD ITEM TO LIST
              this.$store.dispatch('catalogitemAdd', resp.data)
              this.$store.dispatch('catalogitemediting', resp.data)
              this.setItemeditingValues(resp.data)
              //SET CATALOG ITEM editing ID
            } else {
              const itemData = { ...postData, image_data: this.image_data }
              console.log(itemData)
              Object.keys(itemData).forEach(key => {
                this.$store.dispatch('catalogitemSetValue', {
                  id: this.id,
                  key: key,
                  data: itemData[key]
                })
              })
              // this.$store.dispatch('catalogitemSetValue', {
              //   id: this.id,
              //   key: 'image_data',
              //   data: this.image_data
              // })
              this.setItemeditingValues(itemData)
            }
          }
          //set originalItem to item
        })
        .catch(err => console.log(err))

      this.loading = null
    },
    setItemeditingValues(values) {
      for (let item in values) {
        this[item] = values[item]
        this.$set(this.originalValues, item, values[item])
      }
    },
    updateImage(imageData) {
      console.log(imageData)
      this.$set(this, 'image_data', imageData)
    }
  },
  created() {
    // console.log('catItemEdititing created')
    if (this.catalogItemediting) {
      this.setItemeditingValues(this.catalogItemediting)
    }
  },
  mounted() {
    // console.log('hh')
  }
}
</script>

<style scoped>
p {
  margin-bottom: 4px !important;
}
.modalBody {
  max-height: 65vh;
  overflow-y: scroll;
}

.bounce-top-enter-active {
  -webkit-animation: bounce-top 0.9s both;
  animation: bounce-top 0.9s both;
}

.bounce-top-leave-active {
  animation: fadeOut ease 8s;
  -webkit-animation: fadeOut ease 8s;
  -moz-animation: fadeOut ease 8s;
  -o-animation: fadeOut ease 8s;
  -ms-animation: fadeOut ease 8s;
}

/* ----------------------------------------------
 * Generated by Animista on 2020-3-3 23:18:34
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * fade out
 * ----------------------------------------
 */

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-moz-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-o-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@-ms-keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/**
 * ----------------------------------------
 * animation bounce-top
 * ----------------------------------------
 */
@-webkit-keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}
@keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
    transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
    transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
    transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
}
</style>
