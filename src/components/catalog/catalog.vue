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
      <CatalogItemList :view="view" @newItem="catalogItemAdd"></CatalogItemList>
    </v-col>
    <!-- Edit Catalog Item Modal  -->
    <v-dialog
      v-model="modalCatalogitemEdit"
      persistent
      max-width="800px"
      transition="dialog-transition"
      :key="
        `ciEdit${String(
          catalogItemediting && catalogItemediting.id
            ? catalogItemediting.id
            : 'none'
        )}`
      "
    >
      <catalogItemEdit :isNew="true"></catalogItemEdit>
    </v-dialog>
    <!-- Edit Catalog Item Modal  -->
    <v-dialog
      v-model="modalEditCatalogItemFields"
      persistent
      max-width="700px"
      transition="dialog-transition"
      :key="
        `cifEdit${String(
          catalogItemediting && catalogItemediting.id
            ? catalogItemediting.id
            : 'none'
        )}`
      "
    >
      <catalogItemEditFields
        :key="modalEditCatalogItemFields + ''"
      ></catalogItemEditFields>
    </v-dialog>
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
import CatalogItemList from '@/components/catalog/catalogItem/ciList'
import catalogItemEdit from '@/components/catalog/catalogItem/ciEdit'
import catalogItemEditFields from '@/components/catalog/catalogItem/ciEditFields'
import filterBtn from '@/components/global/buttons/filterDrawerToggle'
import imagePreviewModal from '@/components/images/imagePreviewModal'
export default {
  name: 'catalog',
  components: {
    CatalogItemList,
    catalogItemEdit,
    catalogItemEditFields,
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
      catalogItemediting: state => state.catalogitemediting,
      catalogitemFieldsediting: state => state.catalogitemFieldsediting,
      categoryediting: state => state.categoryediting,
      imagePreviewData: state => state.imagePreviewData,
      modalCatalogitemEdit: state => state.modalCatalogitemEdit,
      modalCatalogCustomfield: state => state.modalCatalogCustomfield,
      modalEditCatalogItemFields: state =>
        state.modalCatalogitemEditCustomfields,
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
      this.$store.dispatch('setStateValue', {
        key: 'catalogitemediting',
        value: this.catalogItemCreateNew()
      })
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogitemEdit')
      }, 500)
    },
    categoryAdd() {
      this.editCategoryModal = true
      this.$store.dispatch('setStateValue', {
        key: 'categoryEditing',
        value: null
      })
      this.$store.dispatch('toggleModalEditCategory')
    },
    catalogItemCreateNew() {
      const newItem = { ...this.$store.state.defaultCatalogItem }
      const {
        Default_reservation_length,
        Default_reservation_buffer
      } = this.settings.reduce((acc, setting) => {
        if (
          setting.name === 'Default_reservation_buffer' ||
          setting.name === 'Default_reservation_length'
        ) {
          acc[setting.name] = setting
        }
        return acc
      }, {})
      newItem.reservation_buffer = Default_reservation_buffer.setting
      newItem.reservation_length = Default_reservation_length.setting

      return newItem
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
