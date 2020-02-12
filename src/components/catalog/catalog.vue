<template>
  <v-row
    fill-height
    align-start
    justify="space-between"
    dense
    no-gutters
    class="d-flex flex-column"
  >
    <v-col cols="12" class="pa-0 flex-shrink-1">
      <!-- <v-sheet height="10vh"> -->
      <v-toolbar height="40" flat color="background">
        <!-- <v-btn outlined class="mr-4" @click="setToday">Today</v-btn> -->
        <v-menu bottom right>
          <template v-slot:activator="{ on }">
            <v-btn large text color="primary" v-on="on" class="px-0">
              <span class="title font-weight-bold">{{ viewLabels[view] }}</span>
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="view = 'catalog'">
              <v-list-item-title>CATALOG</v-list-item-title>
            </v-list-item>
            <v-list-item @click="view = 'category'">
              <v-list-item-title>CATEGORIES</v-list-item-title>
            </v-list-item>
            <v-list-item @click="view = 'overview'">
              <v-list-item-title>OVERVIEW</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-spacer></v-spacer>
        <!-- <v-btn outlined color="primary" class="mr-4" @click="catalogItemAdd">
          <v-icon left>mdi-bookmark-plus-outline</v-icon>NEW
        </v-btn>-->
        <v-menu bottom right>
          <template v-slot:activator="{ on }">
            <v-btn icon color="primary" v-on="on">
              <v-icon color="primary">mdi-note-plus</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="catalogItemAdd">
              <v-list-item-title>CATALOG ITEM</v-list-item-title>
            </v-list-item>
            <v-list-item @click="categoryAdd">
              <v-list-item-title>CATEGORY</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn icon>
          <v-icon color="primary">{{ 'mdi-filter' }}</v-icon>
        </v-btn>
      </v-toolbar>
    </v-col>
    <v-col cols="12" class="pa-0 flex-grow-1">
      <component :is="view" :view="view"></component>
    </v-col>
    <!-- Edit Category Modal  -->
    <v-dialog
      v-model="modalCategoryEdit"
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <categoryEdit :key="'cEdit' + String(categoryEditting)"></categoryEdit>
    </v-dialog>
    <!-- Edit Catalog Item Modal  -->
    <v-dialog
      v-model="modalCatalogitemEdit"
      persistent
      max-width="500px"
      transition="dialog-transition"
      :key="
        `ciEdit${String(
          catalogItemEditting && catalogItemEditting.id
            ? catalogItemEditting.id
            : 'none'
        )}`
      "
    >
      <catalogItemEdit></catalogItemEdit>
    </v-dialog>
    <!-- Edit Catalog Item Modal  -->
    <v-dialog
      v-model="modalEditCatalogItemFields"
      persistent
      max-width="500px"
      transition="dialog-transition"
      :key="
        `cifEdit${String(
          catalogItemEditting && catalogItemEditting.id
            ? catalogItemEditting.id
            : 'none'
        )}`
      "
    >
      <catalogItemEditFields :key="modalEditCatalogItemFields + ''"></catalogItemEditFields>
    </v-dialog>
    <!-- Catalog Custom Fields Mgmtm Modal  -->
    <!-- <v-dialog
      v-model="modalCatalogCustomfield"
      persistent
      max-width="500px"
      transition="dialog-transition"
      :key="
        `cinewfEdit${String(
          catalogItemEditting && catalogItemEditting.id
            ? catalogItemEditting.id
            : 'none'
        )}`
      "
    >
      <catalogCustomfield></catalogCustomfield>
    </v-dialog>-->
    <v-dialog
      :value="modalImageFullPreview"
      transition="dialog-transition"
      :key="
        `imgPrev${String(
          imagePreviewData && imagePreviewData.id ? imagePreviewData.id : 'none'
        )}`
      "
      @input="$store.dispatch('toggleModalImageFullPreview')"
    >
      <imagePreviewModal></imagePreviewModal>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import catalog from '@/views/catalog/catalog'
import catalogItemEdit from '@/components/catalog/catalogItemEdit'
import catalogItemEditFields from '@/components/catalog/catalogItemEditFields'
import categoryEdit from '@/components/catalog/categoryEdit'
import category from '@/views/catalog/category'
import imagePreviewModal from '@/components/images/imagePreviewModal'
import overview from '@/views/catalog/overview'
export default {
  components: {
    catalog,
    catalogCustomfield: () =>
      import('@/components/catalog/catalogCustomfieldManagement'),
    catalogItemEdit,
    catalogItemEditFields,
    category,
    categoryEdit,
    imagePreviewModal,
    overview
  },
  data: () => ({
    editCategoryData: {
      id: null,
      color: 'primary',
      name: null
    },
    viewLabels: {
      overview: 'OVERVIEW',
      catalog: 'CATALOG',
      category: 'CATEGORIES'
    }
  }),
  computed: {
    ...mapState({
      catalogView: state => state.catalogView,
      catalogItemEditting: state => state.catalogitemEditting,
      catalogitemFieldsEditting: state => state.catalogitemFieldsEditting,
      categoryEditting: state => state.categoryEditting,
      imagePreviewData: state => state.imagePreviewData,
      modalCatalogitemEdit: state => state.modalCatalogitemEdit,
      modalCatalogCustomfield: state => state.modalCatalogCustomfield,
      modalEditCatalogItemFields: state =>
        state.modalCatalogitemEditCustomfields,
      modalCategoryEdit: state => state.modalCategoryEdit,
      modalImageFullPreview: state => state.modalImageFullPreview
    }),
    view: {
      set(val) {
        this.$store.commit('catalogView', val)
        localStorage.setItem('lastViewCatalog', val)
      },
      get() {
        return this.catalogView
      }
    }
  },
  methods: {
    catalogItemAdd() {
      console.log('catalogItemAdd')
      this.$store.dispatch('catalogitemEditting', null)
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogitemEdit')
      }, 500)
    },
    categoryAdd() {
      this.editCategoryModal = true
      console.log('categoryAdd')
      this.$store.dispatch('categoryEdit', null)
      this.$store.dispatch('toggleModalEditCategory')
    }
  },
  created() {
    this.view = localStorage.getItem('lastViewCatalog')
      ? localStorage.getItem('lastViewCatalog')
      : 'overview'
  }
}
</script>

<style></style>
