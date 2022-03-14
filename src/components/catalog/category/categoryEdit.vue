<template>
  <v-card>
    <modal-title :text="id ? 'EDIT CATEGORY' : 'ADD CATEGORY'"></modal-title>

    <v-card-text class="pt-4">
      <form @submit.prevent="saveCategory">
        <v-row class="justify-center align-center">
          <v-col cols="2">
            <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
              <template v-slot:activator="{ on }">
                <v-avatar
                  v-on="on"
                  :color="color"
                  size="75"
                  class="hoverPointer"
                >
                  <v-icon color="secondary">mdi-palette</v-icon>
                </v-avatar>
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
          <v-col cols="10" offset="2">
            <v-tooltip color="primary" top>
              <template v-slot:activator="{ on }">
                <v-sheet v-on="on" color="transparent" max-width="250">
                  <v-switch
                    :disabled="isDefaultCategory || !id"
                    :messages="
                      isDefaultCategory
                        ? 'Toggle default on another category to remove.'
                        : id
                        ? `Set default category and remove from: ${defaultCategory.name} `
                        : 'Create new category to set as default'
                    "
                    label="Default Category"
                    :value="isDefaultCategory"
                    @change="setDefaultCategory"
                  ></v-switch>
                </v-sheet>
              </template>
              <v-sheet
                color="transparent"
                v-html="
                  isDefaultCategory
                    ? 'Toggle default on another category to remove.'
                    : `Set as default category. <br /> (currently: ${defaultCategory.name})`
                "
                class="secondary--text"
              ></v-sheet>
            </v-tooltip>
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
                  configured default category of
                  <strong>"{{ defaultCategory.name }}"</strong>
                </p>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-around">
            <v-btn
              color="warning"
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
      <v-tooltip color="primary" :value="!id" top>
        <template v-slot:activator="{ on }">
          <v-sheet v-on="on" color="transparent">
            <v-btn
              text
              color="error"
              :disabled="!id || isDefaultCategory"
              :loading="loading === 'delete'"
              @click="modalConfirmDelete = !modalConfirmDelete"
              >DELETE</v-btn
            >
          </v-sheet>
        </template>
        <span>{{
          isDefaultCategory
            ? 'Cannot delete default category.'
            : 'Delete category'
        }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>
      <v-btn
        text
        :color="saveDisabled ? 'primary' : 'warning'"
        @click="cancel"
        class="mr-4"
        >{{ saveDisabled ? 'CLOSE' : 'CANCEL' }}</v-btn
      >
      <v-btn
        text
        color="success"
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
      categoryEditing: state => state.categoryEditing,
      settings: state => state.appSettings
    }),
    categoryEditingData() {
      return filters.categoryById(this.categoryEditing, this.categories)
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
    isDefaultCategory() {
      return this.id == this.defaultCategory.id
    },
    nameAvailable() {
      const nameMatches = this.categories.find(
        el => el.name.toLowerCase() === String(this.name).toLowerCase()
      )
      if (!this.name) {
        return 'Name Required'
      }
      if (nameMatches !== undefined) {
        if (
          !this.id ||
          (this.categoryEditingData &&
            this.name !== this.categoryEditingData.name)
        ) {
          return 'Category name already exists.'
        }
      }

      return null
    },
    saveDisabled() {
      return !this.dataChanged || this.nameAvailable !== null
    }
  },
  methods: {
    cancel() {
      this.loading = null
      this.$emit('close')
    },

    deleteCategory() {
      this.loading = 'delete'
      this.modalConfirmDelete = false
      this.$store
        .dispatch('categoryDelete', {
          id: this.id
        })
        .then(res => {
          if (res?.status === 'success') {
            this.cancel()
          }
        })
        .catch(err => {
          console.error(err)
        })
      this.loading = null
    },

    resetForm() {
      this.color = this.$vuetify.theme.primary || 'primary'
      this.id = null
      this.loading = false
      this.name = null
    },
    saveCategory() {
      if (this.saveDisabled) return
      this.loading = 'save'
      this.$store
        .dispatch('categoryEditSave', {
          id: this.id,
          name: this.name,
          color: this.color,
          isNew: this.id === null
        })
        .then(res => {
          if (res?.status === 'success') {
            this.id = res.data
            this.cancel()
          }
          this.loading = null
          this.$store.dispatch('toggleSnackbar', res)
        })
        .catch(err => {
          console.error('ERROR: ' + err)
        })
    },
    setDefaultCategory() {
      this.$store.dispatch('appSettingUpdate', {
        settingName: 'Default_Category',
        settingValue: this.id
      })
      this.$store.dispatch('localStorageWrite', {
        key: `appSettings`,
        data: [...this.settings]
      })
      this.$store.dispatch('toggleSnackbar', {
        status: 'success',
        message: `${this.categoryEditingData.name} set as default category.`
      })
    }
  },

  mounted() {
    if (this.categoryEditing) {
      const data = filters.categoryById(this.categoryEditing, this.categories)
      this.color = data?.color || this.$vuetify.theme.primary || 'primary'
      this.id = data?.id || null
      this.name = data?.name || null
      //SET INITIAL VALUES TO KEEP TRACK OF
      this.originalColor = this.color
      this.originalName = this.name
    }
  }
}
</script>

<style>
.defaultCategoryIcon {
  position: absolute;
  right: 1rem;
  top: 0.75rem;
}
</style>
