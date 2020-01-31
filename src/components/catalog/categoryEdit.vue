<template>
  <v-card>
    <v-card-title class="justify-center title primary--text">
      {{ id ? 'EDIT CATEGORY' : 'ADD CATEGORY' }}
    </v-card-title>
    <v-card-text>
      <form>
        <v-row class="justify-center align-center">
          <v-col cols="2">
            <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
              <template v-slot:activator="{ on }">
                <v-avatar v-on="on" :color="color"> </v-avatar>
              </template>
              <v-color-picker
                v-model="color"
                class="ma-2"
                hide-inputs
              ></v-color-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-text-field
              v-model="name"
              label="Name"
              name="name"
              textarea
              :error-messages="nameAvailable"
            ></v-text-field>
          </v-col>
        </v-row>
      </form>
      <v-dialog
        v-model="modalConfirmDelete"
        max-width="500px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title class="justify-center title error--text">
            CONFIRM DELETE
          </v-card-title>
          <v-card-text>
            <v-row class="justify-center align-center">
              <v-col cols="12" class="align-center">
                <p class="font-weight-bold text-center">
                  WARNING: You are about to delete the category called "{{
                    name
                  }}".
                </p>
                <p class=" text-center">
                  All catalog items under this category will be set to the
                  configured default category of "{{ defaultCategory.name }}"
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
        >DELETE</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="cancel">CANCEL</v-btn>
      <v-btn
        text
        small
        color="primary"
        :disabled="saveDisabled"
        :loading="loading === 'save'"
        @click="saveCategory"
        >SAVE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters'
export default {
  name: 'categoryEdit',
  data: () => ({
    color: 'primary',
    id: null,
    loading: false,
    name: null,
    modalConfirmDelete: false,
    originalName: null,
    originalColor: 'primary'
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      categories: state => state.categories,
      categoryEditting: state => state.categoryEditting,
      settings: state => state.settings
    }),
    categoryEdittingData() {
      return filters.categoryById(this.categoryEditting, this.categories)
    },
    dataChanged() {
      return (
        this.name !== this.originalName || this.color !== this.originalColor
      )
    },
    defaultCategory() {
      const defaultCat = filters.getObjectFromArray(
        this.settings,
        'name',
        'Default_Category',
        'setting'
      )
      const cat = filters.getObjectFromArray(this.categories, 'id', defaultCat)
      return cat
    },
    nameAvailable() {
      const nameMatches = this.categories.find(
        el =>
          el.name.toLowerCase() === String(this.name).toLowerCase() &&
          el.id !== this.id
      )
      if (!this.name) {
        return 'Name Required'
      }
      if (
        nameMatches !== undefined &&
        this.categoryEdittingData &&
        this.name !== this.categoryEdittingData.name
      ) {
        return 'Category name already exists.'
      }
      return null
    },
    saveDisabled() {
      return !this.dataChanged || this.nameAvailable !== null
    }
  },
  methods: {
    cancel() {
      // this.resetForm();
      this.loading = null
      this.$store.dispatch('toggleModalEditCategory')
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
    saveCategory() {
      this.loading = 'save'
      this.$store
        .dispatch('categoryEditSave', {
          id: this.id,
          name: this.name,
          color: this.color,
          isNew: this.id === null
        })
        .then(res => {
          console.log(res)
          if (res.status) {
            if (res.status === 'success') {
              //alert success
              this.id = res.data
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
    }
  },
  created() {
    if (this.categoryEditting) {
      const data = filters.categoryById(this.categoryEditting, this.categories)
      this.color = data.color
      this.id = data.id
      this.name = data.name
      //SET INITIAL VALUES TO KEEP TRACK OF
      this.originalColor = data.color
      this.originalName = data.name
    }
  },
  mounted() {}
}
</script>

<style></style>
