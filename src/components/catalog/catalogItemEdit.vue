<template>
  <v-card>
    <v-card-title class="justify-center title primary--text">
      {{ id ? 'EDIT ITEM' : 'ADD ITEM' }}
    </v-card-title>
    <v-card-text>
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
          <v-col cols="2" class="text-left">
            <v-card
              flat
              class="d-flex flex-column align-start justify-center pa-1"
            >
              <p class="mb-0">Color</p>
              <div>
                <v-menu
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                >
                  <template v-slot:activator="{ on }">
                    <v-avatar tile v-on="on" :color="color"> </v-avatar>
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
          <v-col cols="10" class="text-left">
            <v-text-field
              v-model="abbreviation"
              label="Abbreviation"
              name="abbr"
              textarea
              :error-messages="abbreviationAvailable"
            ></v-text-field
          ></v-col>
          <v-col cols="12">
            <v-textarea
              v-model="description"
              label="Decription"
              auto-grow
              dense
              outlined
              rows="4"
              class="mt-4"
            >
            </v-textarea>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="categoryName"
              :items="categories"
              item-text="name"
              item-value="name"
              label="Category"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              label="Status"
              :items="statusOptions"
              v-model="status"
            ></v-select>
          </v-col>
          <v-col cols="12">
            IMAGE UPLOAD
          </v-col>
          <v-col cols="12">
            <v-card outlined class="pa-2">
              <v-row justify="space-between" no-gutters="">
                <v-col cols="8">
                  <span class="title primary--text">ADDITIONAL DETAILS</span>
                </v-col>
                <v-col class="text-right">
                  <v-btn flat icon color="warning">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn flat icon color="primary">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <template v-for="field in customFields">
                <v-row :key="field + 'rw'" align="center">
                  <v-col class="subheadin primary--text font-weight-bold">{{
                    field.name
                  }}</v-col>
                  <v-col>{{ field.value }}</v-col>
                  <v-col
                    ><v-icon small>{{
                      field.internal === '1' ? 'mdi-eye-off' : 'mdi-eye'
                    }}</v-icon></v-col
                  >
                </v-row>
              </template>
            </v-card>
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
                  WARNING: You are about to delete the catalog item called "{{
                    name
                  }}".
                </p>
                <p class=" text-center">
                  All current reservations for this item will be removed."
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
import { mapState } from 'vuex';
export default {
  name: 'catalogItemEdit',
  data: () => ({
    color: 'primary',
    customFields: [],
    defaultItem: {
      abbreviation: null,
      categoryName: null,
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
      return true;
    },
    abbreviationAvailable() {
      return null;
    },
    nameAvailable() {
      const nameMatches = this.catalogItems.find(
        el =>
          el.name.toLowerCase() === String(this.name).toLowerCase() &&
          el.id !== this.id
      );
      if (!this.name) {
        return 'Name Required';
      }
      if (nameMatches !== undefined) {
        return 'Category name already exists.';
      }
      return null;
    },
    saveDisabled() {
      return !this.dataChanged || this.nameAvailable !== null;
    }
  },
  methods: {
    cancel() {
      // this.resetForm();
      this.loading = null;
      this.$store.dispatch('toggleModalCatalogitemEdit');
    },
    resetForm() {
      this.color = this.$vuetify.theme.primary || 'primary';
      this.id = null;
      this.loading = false;
      this.name = null;
    },
    deleteCategory() {
      this.loading = 'delete';
      this.modalConfirmDelete = false;
      this.$store
        .dispatch('categoryDelete', {
          id: this.id
        })
        .then(res => {
          console.log(res);
          if (res.status) {
            if (res.status === 'success') {
              this.$store.dispatch('toggleModalEditCategory');
            } else {
              //display error message returned from backend
              console.log('res.status!= success', res);
            }
            this.loading = null;
          }
        })
        .catch(err => {
          console.log(err);
          alert('ERROR: ' + err);
        });
    },
    saveCategory() {
      this.loading = 'save';
      this.$store
        .dispatch('categoryEditSave', {
          id: this.id,
          name: this.name,
          color: this.color,
          isNew: this.id === null
        })
        .then(res => {
          console.log(res);
          if (res.status) {
            if (res.status === 'success') {
              //alert success
              this.id = res.data;
              this.$store.dispatch('toggleModalEditCategory');
            } else {
              //display error message returned from backend

              console.log('res.status!= success', res);
            }
            this.loading = null;
          }
        })
        .catch(err => {
          console.log(err);
          alert('ERROR: ' + err);
        });
    }
  },
  created() {
    if (this.catalogItemEditting) {
      for (let item in this.catalogItemEditting) {
        this[item] = this.catalogItemEditting[item];
      }
    }
  },
  mounted() {}
};
</script>

<style></style>
