<template>
  <v-row fill-height align-start justify-start dense>
    <v-col cols="12">
      <!-- <v-sheet height="10vh"> -->
      <v-toolbar flat color="white">
        <!-- <v-btn outlined class="mr-4" @click="setToday">Today</v-btn> -->
        <v-menu bottom right>
          <template v-slot:activator="{ on }">
            <v-btn outlined color="primary" v-on="on">
              <span>{{ viewLabels[view] }}</span>
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
        </v-btn> -->
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
    <v-col cols="12">
      <component :is="view" :view="view"></component>
    </v-col>
    <v-col cols="12">
      <v-dialog
        v-model="modalCategoryEdit"
        persistent
        max-width="500px"
        transition="dialog-transition"
      >
        <categoryEdit :key="'cEdit' + String(categoryEditting)"></categoryEdit>
      </v-dialog>
      <v-dialog
        v-model="modalCatalogitemEdit"
        persistent
        max-width="500px"
        transition="dialog-transition"
      >
        <catalogItemEdit
          :key="
            `ciEdit${String(
              catalogItemEditting && catalogItemEditting.id
                ? catalogItemEditting.id
                : 'none'
            )}`
          "
        ></catalogItemEdit>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import catalog from '@/views/catalog/catalog';
import catalogItemEdit from '@/components/catalog/catalogItemEdit';
import categoryEdit from '@/components/catalog/categoryEdit';
import category from '@/views/catalog/category';
import overview from '@/views/catalog/overview';
export default {
  components: {
    catalog,
    catalogItemEdit,
    category,
    categoryEdit,
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
      categoryEditting: state => state.categoryEditting,
      modalCatalogitemEdit: state => state.modalCatalogitemEdit,
      modalCategoryEdit: state => state.modalCategoryEdit
    }),
    view: {
      set(val) {
        this.$store.commit('catalogView', val);
      },
      get() {
        return this.catalogView;
      }
    }
  },
  methods: {
    catalogItemAdd() {
      console.log('catalogItemAdd');
    },
    categoryAdd() {
      this.editCategoryModal = true;
      console.log('categoryAdd');
      this.$store.dispatch('categoryEdit', null);
      this.$store.dispatch('toggleModalEditCategory');
    }
  }
};
</script>

<style></style>
