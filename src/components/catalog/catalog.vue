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
      <v-toolbar height="40" flat color="background primary--text">
        <span class="title font-weight-bold">CATALOG</span>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" @click="catalogItemAdd">
          <v-icon color="primary">mdi-note-plus</v-icon>
        </v-btn>
        <filterBtn></filterBtn>
      </v-toolbar>
    </v-col>
    <v-col cols="12" class="mt-4 pa-0 flex-grow-1">
      <catalogItemList :view="view" @newItem="catalogItemAdd"></catalogItemList>
    </v-col>
    <!-- Edit Catalog Item Modal  -->
    <v-dialog
      v-model="modalCatalogItemEdit"
      persistent
      max-width="800px"
      transition="dialog-transition"
      :key="
        `ciEdit${String(
          catalogItemEditing && catalogItemEditing.id
            ? catalogItemEditing.id
            : 'none'
        )}`
      "
    >
      <catalogItemEdit :isNew="true"></catalogItemEdit>
    </v-dialog>
    <!-- Edit Catalog Item Custom fields Modal  -->

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
import catalogItemList from '@/components/catalog/catalogItem/ciList'
import catalogItemEdit from '@/components/catalog/catalogItem/ciEdit'
import filterBtn from '@/components/global/buttons/filterDrawerToggle'
import imagePreviewModal from '@/components/images/imagePreviewModal'
export default {
  name: 'catalog',
  components: {
    catalogItemList,
    catalogItemEdit,
    filterBtn,
    imagePreviewModal
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
      catalogItemEditing: state => state.catalogItemEditing,
      ciFieldsEditing: state => state.ciFieldsEditing,
      categoryEditing: state => state.categoryEditing,
      imagePreviewData: state => state.imagePreviewData,
      modalCatalogItemEdit: state => state.modalCatalogItemEdit,

      modalCategoryEdit: state => state.modalCategoryEdit,
      modalImageFullPreview: state => state.modalImageFullPreview,
      settings: state => state.appSettings
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
      this.$store.dispatch('catalogItemNew', this.$vuetify)
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogItemEdit')
      }, 500)
    },
    categoryAdd() {
      this.editCategoryModal = true
      this.$store.dispatch('setStateValue', {
        key: 'categoryEditing',
        value: null
      })
      this.$store.dispatch('toggleModalEditCategory')
    }
  },
  mounted() {
    if (this.$vuetify.breakpoint.lgAndUp)
      this.$store.dispatch('setStateValue', {
        key: 'sideDrawer',
        value: true
      })
  }
}
</script>

<style></style>
