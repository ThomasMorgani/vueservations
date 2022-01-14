<template>
  <v-card height="100%">
    <v-card-title class="justify-center title primary--text">
      {{ id ? 'EDIT ITEM' : 'ADD ITEM' }}
    </v-card-title>
    <v-card-text class="pr-0">
      <v-tabs v-model="tab" background-color="transparent" color="primary" grow>
        <v-tab key="0">INFO</v-tab>
        <v-tab key="1">DETAILS</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" class="modalBody pr-6">
        <v-tab-item key="0" class="tabItem">
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
                  :items="orderBy(categories, 'name')"
                  item-text="name"
                  item-value="id"
                  label="Category"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  label="Status"
                  :items="statusOptions"
                  item-text="text"
                  item-value="value"
                  v-model="status"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-action>
                      <v-icon :color="item.color" v-text="item.icon"></v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-list-item>
                      <v-list-item-action class="mr-4">
                        <v-icon :color="item.color" v-text="item.icon"></v-icon>
                      </v-list-item-action>
                      <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12">
                <v-row dense>
                  <v-col cols="6">
                    <v-card height="5rem" outlined class="d-flex pa-2">
                      <v-sheet
                        color="transparent"
                        class="d-flex flex-shrink-1 align-start justify-start"
                      >
                        <p class="primary--text">Color</p>
                      </v-sheet>
                      <v-sheet
                        color="transparent"
                        height="100%"
                        width="100%"
                        class="d-flex flex-grow-1 align-center justify-center"
                      >
                        <v-menu
                          :close-on-content-click="false"
                          :nudge-width="200"
                          offset-x
                        >
                          <template v-slot:activator="{ on }">
                            <v-sheet
                              v-on="on"
                              :color="color"
                              height="100%"
                              width="50%"
                              class="hoverPointer d-flex align-center justify-center br-1"
                            >
                              <v-icon color="white">mdi-palette</v-icon>
                            </v-sheet>
                          </template>
                          <v-color-picker
                            v-model="color"
                            class="ma-2"
                            hide-inputs
                          ></v-color-picker>
                        </v-menu>
                      </v-sheet>
                    </v-card>
                  </v-col>
                  <v-col cols="6">
                    <v-card height="5rem" outlined class="d-flex pa-2">
                      <v-sheet
                        color="transparent"
                        class="d-flex flex-shrink-1 align-start justify-start"
                      >
                        <p class="primary--text">Image</p>
                      </v-sheet>
                      <v-sheet
                        color="transparent"
                        height="100%"
                        width="100%"
                        class="d-flex flex-grow-1 align-center justify-center"
                      >
                        <v-sheet
                          color="transparent"
                          height="100%"
                          width="50%"
                          class="hoverPointer d-flex align-center justify-center br-1"
                        >
                          <v-img
                            :src="imageDisplayed"
                            height="100%"
                            width="100%"
                            hover
                            @click="modalEditImage = !modalEditImage"
                            class="hoverPointer"
                          ></v-img>
                        </v-sheet>
                      </v-sheet>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="description"
                  auto-grow
                  color="primary"
                  dense
                  hide-details=""
                  label="Description"
                  outlined
                  rows="4"
                  class="mt-2"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-row dense>
                  <v-col cols="6">
                    <v-text-field
                      color="primary"
                      name="ReservationLength"
                      label="Reservation length (days)"
                      min="0"
                      :rules="[
                        val =>
                          isNaN(val) || val < 1
                            ? 'Number greater than 0 required'
                            : true
                      ]"
                      type="number"
                      v-model="reservation_length"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="reservation_buffer"
                      color="primary"
                      label="Reservation buffer (days)"
                      min="0"
                      name="ReservationBuffer"
                      type="number"
                      :rules="[
                        val =>
                          isNaN(val) || val < 0
                            ? 'Number greater than 0 required'
                            : true
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="internal"
                  item-text="text"
                  item-value="value"
                  :items="boolTypes"
                  color="primary"
                  dense
                  full-width
                  hide-details=""
                  label="Visibility"
                  prepend-icon="mdi-eye"
                  class="mt-0 pt-0"
                ></v-select>
              </v-col>
            </v-row>
          </form>
        </v-tab-item>
        <v-tab-item key="1" class="tabItem pt-4">
          <v-card height="100%" outlined>
            <v-row>
              <v-col cols="12">
                <v-card flat height="100%" class="pa-2">
                  <v-card-text>
                    <v-row justify="space-between" no-gutters>
                      <v-col cols="12">
                        <customFieldsList
                          :items="customFieldsDisplayed"
                        ></customFieldsList>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
    <v-card-actions>
      <v-tooltip color="primary" top :disabled="!id">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              :color="tab === 0 ? 'error' : 'warning'"
              :disabled="tab === 0 && !id"
              :loading="loading === 'delete'"
              @click="tab === 0 ? deletePrompt() : editCustomFields()"
            >
              <v-icon
                :color="tab === 0 ? 'error' : 'warning'"
                v-text="`mdi-${tab === 0 ? 'trash-can' : 'pencil'}`"
              ></v-icon>

              {{ tab === 0 ? 'DELETE' : 'EDIT FIELDS' }}</v-btn
            >
          </div>
        </template>
        <span>{{ tab === 0 ? 'Delete catalog item' : 'Edit Details' }}</span>
      </v-tooltip>

      <v-tooltip color="primary" top>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              color="warning"
              text
              large
              :disabled="!id || !isChanged"
              @click="resetChanges"
              >RESET</v-btn
            >
          </div>
        </template>
        <span>Revert all unsaved changes</span>
      </v-tooltip>

      <v-spacer></v-spacer>
      <v-btn text large color="primary" @click="cancel">CLOSE</v-btn>
      <v-tooltip color="primary" top :disabled="!saveDisabled && !isChanged">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              large
              color="primary"
              :disabled="saveDisabled"
              :loading="loading === 'save'"
              @click="save"
            >
              <transition name="bounce-top">
                <v-icon
                  color="warning"
                  class="mr-1"
                  v-if="isChanged && !saveDisabled"
                  >mdi-content-save-alert</v-icon
                > </transition
              >SAVE
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
      persistent
      transition="dialog-transition"
      :key="modalEditImage + 'imgModal'"
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
      persistent
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
import { mapGetters, mapState } from 'vuex'
import customFieldsList from '@/components/catalog/catalogItem/ciCustomFieldsList'
import * as formats from '@/modules/formats.js'
import Vue2Filters from 'vue2-filters'

export default {
  name: 'catalogItemEdit',
  components: {
    customFieldsList,
    editImageModal: () =>
      import('@/components/catalog/catalogItem/ciEditImage'),
    eventTableSimple: () => import('@/components/global/tableSimple')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    abbreviation: null,
    affectedEventData: null,
    boolTypes: [
      {
        value: '0',
        text: 'Public listing'
      },
      {
        value: '1',
        text: 'Internal use only'
      }
    ],
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
      internal: '0',
      name: null,
      reservation_buffer: null,
      reservation_length: null,
      status: null
    },
    description: null,
    id: null,
    image: null,
    image_data: {},
    internal: '0',
    loading: false,
    modalConfirmDelete: false,
    modalEditImage: false,
    name: null,
    originalValues: {},
    reservation_buffer: null,
    reservation_length: null,
    status: null,
    tab: null
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      catalogItemediting: state => state.catalogitemediting,
      categories: state => state.categories,
      images: state => state.images,
      statusData: state => state.statusData,
      events: state => state.events,
      patrons: state => state.patrons
    }),
    ...mapGetters(['appSettingsByName', 'defaultCiImage']),
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
      //TODO: CREATE GLOBAL (utils/formats) FORMAT IMAGE FUNCTION TO PROPERLY SET SRC

      return this.image_data.srcType === 'url'
        ? this.image_data.src
        : this.image_data.file_name
        ? this.$apiSettings.baseUrl + this.image_data.src
        : this.defaultCiImage
    },
    isChanged() {
      //TODO: FIND WHY AFTER SAVING isChanged does not reset to false
      let isChanged = false
      // let origStr = this.originalValues.toString()
      // let loadingState = this.loading
      //console.log(this.originalValues)
      Object.keys(this.defaultItem).forEach(field => {
        if (field !== 'customFields' && field !== 'categoryName') {
          if (field === 'image_data') {
            if (
              this[field] &&
              this.originalValues[field] &&
              this[field].id &&
              this[field].id !== this.originalValues[field].id
            ) {
              //console.log(field)
              isChanged = true
            }
          } else {
            if (this.originalValues[field] !== this[field]) {
              //console.log(field)
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
          field !== 'internal' &&
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
    },
    statusOptions() {
      const statuses = ['enabled', 'disabled', 'blocked']
      const statusItems = []
      statuses.forEach(s => statusItems.push(this.statusData[s]))
      return statusItems
    }
  },
  methods: {
    cancel() {
      // this.resetForm();
      this.loading = null
      this.$store.dispatch('toggleModalCatalogitemEdit')
    },
    deleteCatalogitem() {
      //console.log('delete')
      this.$store
        .dispatch('catalogitemDelete', { id: this.id })
        .then(() => {
          this.$store.dispatch('setStateValue', {
            key: 'events',
            value: this.events.filter(e => e.item_id !== this.id)
          })
          this.modalConfirmDelete = !this.modalConfirmDelete
          this.$store.dispatch('localStorageWrite', {
            key: 'catalogItems',
            data: this.catalogItems
          })
          this.$store.dispatch('localStorageWrite', {
            key: 'events',
            data: this.events
          })
          this.$store.dispatch('toggleSnackbar', {
            status: 'success',
            message: 'Catalog item deleted.'
          })
          this.$store.dispatch('toggleModalCatalogitemEdit')
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
        'description',
        'id',
        'internal',
        'name',
        'note',
        'reservation_buffer',
        'reservation_length',
        'status'
      ]
      const ciData = {}
      itemValues.forEach(val => (ciData[val] = this[val]))
      ciData.image_data = this.image_data
      const isNew = !ciData.id
      if (isNew) {
        //TODO: WE SHOULD BE ABLE TO WORK THIS INTO UPDATE FUNCTION ON SERVERSIDE
        ciData.customFields = this.catalogItemediting.customFields
        ciData.id = new Date().getTime()
        //ADD ITEM TO LIST
        this.$store.dispatch('catalogitemAdd', ciData)
        // this.$store.dispatch('catalogitemediting', ciData)
        this.setItemeditingValues(ciData)
        //SET CATALOG ITEM editing ID
      } else {
        const itemData = { ...ciData, image_data: this.image_data }
        //console.log(itemData)
        Object.keys(itemData).forEach(key => {
          this.$store.dispatch('catalogitemSetValue', {
            id: this.id,
            key: key,
            data: itemData[key]
          })
        })
        this.setItemeditingValues(itemData)
      }

      this.$store.dispatch('localStorageWrite', {
        key: `catalogItems`,
        data: this.catalogItems
      })
      this.$store.dispatch('toggleSnackbar', {
        status: 'success',
        message: 'Catalog item Saved.'
      })

      if (isNew) this.$emit('ciAdded')

      this.loading = null
    },
    setItemeditingValues(values) {
      for (let item in values) {
        this[item] = values[item]
        this.$set(this.originalValues, item, values[item])
      }
    },
    testReservationLength(val) {
      val = parseInt(val)
      return isNaN(val) || val < 1 ? 'Number greater than 0 required' : true
    },
    updateImage(imageData) {
      console.log(imageData)
      this.$set(this, 'image_data', imageData)
    }
  },
  created() {
    // //console.log('catItemEdititing created')
  },
  mounted() {
    // //console.log('hh')
    if (this.catalogItemediting.id) {
      //console.log(this.catalogItemediting)
      this.setItemeditingValues(this.catalogItemediting)
    } else {
      //console.log(this.$vuetify)
      const theme = this.$vuetify.theme.isDark ? 'dark' : 'light'
      this.color = this.$vuetify.theme.themes[theme].primary
      this.image_data = { ...this.image_data, ...this.defaultCiImage }
      //??
      this.reservation_buffer =
        this?.catalogItemediting?.reservation_buffer || null
      this.reservation_length =
        this?.catalogItemediting?.reservation_length || null
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 4px !important;
}
.modalBody {
  height: 65vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.tabItem {
  height: 100%;
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
