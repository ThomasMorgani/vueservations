<template>
  <v-card>
    <v-card-title class="justify-center title primary--text">
      {{
      id ? 'EDIT ITEM' : 'ADD ITEM'
      }}
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
            <v-select label="Status" :items="statusOptions" v-model="status"></v-select>
          </v-col>

          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <v-card outlined class="d-flex flex-column pa-2">
                  <p>Color</p>
                  <div>
                    <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
                      <template v-slot:activator="{ on }">
                        <v-avatar tile v-on="on" :color="color" hover>
                          <v-icon color="white">mdi-palette</v-icon>
                        </v-avatar>
                      </template>
                      <v-color-picker v-model="color" class="ma-2" hide-inputs></v-color-picker>
                    </v-menu>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card outlined class="d-flex flex-column pa-2">
                  <p>Image</p>
                  <!-- <p class="mb-0"></p> -->
                  <v-img
                    src="https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png"
                    height="48"
                    width="48"
                    hover
                  ></v-img>
                  <!-- <v-file-input prepend-inner-icon="mdi-image" prepend-icon label="Select Image"></v-file-input> -->
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
            <v-divider></v-divider>
            <v-card flat class="pa-2">
              <v-row justify="space-between" no-gutters>
                <v-col cols="8">
                  <span class="title primary--text">ADDITIONAL DETAILS</span>
                </v-col>
                <v-col class="text-right">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn text icon color="warning" @click="editCustomFields" v-on="on">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit details</span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <template v-for="field in customFieldsDisplayed">
                <v-row dense :key="field.field_id + 'rw'" align="center">
                  <v-col class="subheading primary--text font-weight-bold">{{ field.name }}</v-col>
                  <v-col>{{ field.value }}</v-col>
                  <v-col>
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-icon
                          small
                          v-on="on"
                        >{{ field.internal === '1' ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                      </template>
                      <span>{{ field.internal === '1' ? 'Internal use only' : 'Visible to public' }}</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </form>
      <v-dialog v-model="modalConfirmDelete" max-width="500px" transition="dialog-transition">
        <v-card>
          <v-card-title class="justify-center title error--text">CONFIRM DELETE</v-card-title>
          <v-card-text>
            <v-row class="justify-center align-center">
              <v-col cols="12" class="align-center">
                <p
                  class="font-weight-bold text-center"
                >WARNING: You are about to delete catalog item:</p>
                <p class="font-weight-bold text-center">"{{name}}"</p>
                <p class="text-center">All current reservations for this item will be removed.</p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-around">
            <v-btn color="primary" text @click="modalConfirmDelete = !modalConfirmDelete">CANCEL</v-btn>
            <v-btn color="error" text @click="deleteCategory">DELETE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        small
        color="primary"
        :disabled="!id"
        :loading="loading === 'delete'"
        @click="modalConfirmDelete = !modalConfirmDelete"
      >DELETE</v-btn>
      <v-btn text small disabled>RESET</v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="cancel">CLOSE</v-btn>

      <v-tooltip top :disabled="!saveDisabled">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              small
              color="primary"
              :disabled="saveDisabled"
              :loading="loading === 'save'"
              @click="save"
            >SAVE</v-btn>
          </div>
        </template>
        <span>{{ saveDisabledText }}</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'catalogItemEdit',
  data: () => ({
    abbreviation: null,
    category: null,
    color: 'primary',
    customFields: [],
    defaultItem: {
      abbreviation: null,
      category: null,
      customFields: [],
      id: null,
      description: null,
      name: null,
      status: null
    },
    id: null,
    loading: false,
    name: null,
    modalConfirmDelete: false,
    status: null,
    statusOptions: ['blocked', 'enabled', 'disabled']
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      catalogItemEditting: state => state.catalogitemEditting,
      categories: state => state.categories
    }),
    dataChanged() {
      return true
    },
    abbreviationAvailable() {
      return null
    },
    customFieldsDisplayed() {
      return this.catalogItemEditting.customFields
    },
    fieldsRequired() {
      let fields = []
      Object.keys(this.defaultItem).forEach(field => {
        if (
          field !== 'id' &&
          field !== 'customFields' &&
          field !== 'description' &&
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
        return 'Category name already exists.'
      }
      return null
    },
    saveDisabled() {
      return (
        !this.dataChanged ||
        this.nameAvailable !== null ||
        this.fieldsRequired.length > 0
      )
    },
    saveDisabledText() {
      let text = 'Errors with form'
      if (this.nameAvailable !== null) {
        text = 'Name must be unique'
      } else if (this.fieldsRequired.length > 0) {
        text = 'The following fields are required:'
        for (let i in this.fieldsRequired) {
          text =
            i == this.fieldsRequired.length - 1
              ? `${text} ${this.fieldsRequired[i]}`
              : `${text} ${this.fieldsRequired[i]},`
        }
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
    editCustomFields() {
      const customFields = this.catalogItemEditting.customFields
        ? this.catalogItemEditting.customFields
        : []
      this.$store
        .dispatch('catalogitemEdittingcustomfieldsSetEditting', customFields)
        .then(() => {
          console.log('then')
          this.$store.dispatch('toggleModalCatalogitemEditCustomfields')
        })
    },
    resetForm() {
      this.color = this.$vuetify.theme.primary || 'primary'
      this.id = null
      this.loading = false
      this.name = null
    },
    deleteCategory() {
      this.loading = 'delete'
      this.modalConfirmDelete = false
      this.$store
        .dispatch('categoryDelete', {
          id: this.id
        })
        .then(res => {
          console.log(res)
          if (res.status) {
            if (res.status === 'success') {
              this.$store.dispatch('toggleModalEditCategory')
            } else {
              //display error message returned from backend
              console.log('res.status!= success', res)
            }
            this.loading = null
          }
        })
        .catch(err => {
          console.log(err)
          alert('ERROR: ' + err)
        })
    },
    save() {
      this.loading = 'save'
      console.log(this)
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
      postData.customFields = this.catalogItemEditting.customFields
      //setup image data
      postData.imageData = []
      console.log(postData)
      const endpoint = itemValues.id
        ? '/catalogitem_update'
        : '/catalogitem_create'
      this.$store
        .dispatch('callApi', {
          endpoint: endpoint,
          postData: postData
        })
        .then(resp => {
          console.log(resp)
          if (resp.status === 'success') {
            Object.keys(postData).forEach(key => {
              this.$store.dispatch('catalogitemSetValue', {
                id: this.id,
                key: key,
                data: postData[key]
              })
            })
          }
          //set originalItem to item
        })
        .catch(err => console.log(err))

      this.loading = null
    }
  },
  created() {
    if (this.catalogItemEditting) {
      // console.log('catItemEdititing created')
      for (let item in this.catalogItemEditting) {
        // if (item === 'color' && this.catalogItemEditting[item] === 'primary') {
        //   this[item] = this.$vuetify.themes.light.primary
        // } else {
        //   this[item] = this.catalogItemEditting[item]
        // }
        this[item] = this.catalogItemEditting[item]
      }
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
  max-height: 90vh;
  overflow-y: auto;
}
</style>
