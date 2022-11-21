<template>
  <v-card flat>
    <v-card-title class="d-flex align-center justify-space-between pb-0">
      <v-sheet
        color="transparent"
        class="text-h6 primary--text font-weight-bold "
      >
        CATEGORIES
      </v-sheet>
      <v-sheet color="transparent" max-width="600" width="100%" class="d-flex">
        <v-text-field
          v-model="search"
          clearable
          color="primary"
          dense
          hide-details
          label="Search"
          name="Search"
          outlined
          prepend-inner-icon="mdi-feature-search"
        ></v-text-field>
        <BtnWithTooltip
          :btnClass="['mx-4']"
          :btnProps="{ icon: true, color: 'primary' }"
          :iconProps="{ icon: 'mdi-sticker-plus' }"
          :tooltipProps="{ disabled: false, color: 'primary', bottom: true }"
          :tooltipText="'Add Category'"
          @click="categoryEdit"
        ></BtnWithTooltip>
      </v-sheet>
    </v-card-title>

    <v-card-text class="pt-0">
      <v-row fill-height align="start" justify="center" dense no-gutters>
        <v-col cols="12" lg="8" class="pa-0 flex-shrink-1">
          <categoryList
            :categories="categoriesDisplayed"
            @itemClicked="categoryEdit"
          ></categoryList>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Edit Category Modal  -->
    <!-- <v-dialog
      v-model="modalCategoryEdit"
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <categoryEdit :key="'cEdit' + String(categoryEditing)"></categoryEdit>
    </v-dialog> -->

    <v-dialog
      v-model="modalAction"
      :key="modalAction"
      scrollable
      persistent=""
      max-width="700px"
      transition="dialog-transition"
    >
      <component
        :is="modalComp"
        :key="modalAction"
        v-bind="modalCompData"
        @actionBtn="onAction"
        @cancel="modalClose"
        @close="modalClose"
      ></component>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import categoryEdit from '@/components/catalog/category/categoryEdit'
import categoryList from '@/components/catalog/category/categoryList'
export default {
  name: 'Categories',
  components: {
    categoryEdit,
    categoryList
  },
  data: () => ({
    modalAction: null,
    modalComp: null,
    modalCompData: null,
    search: ''
  }),
  computed: {
    ...mapState({
      categories: state => state.categories,
      filterCategorySelect: state => state.filterCategorySelect
    }),
    categoriesDisplayed() {
      if (!this.search) return this.categories
      return this.categories
        ? [...this.categories]
            .filter(i =>
              i.name.toLowerCase().includes(this.search.toLowerCase().trim())
            )
            .sort((a, b) => a.name.localeCompare(b.name))
        : []
    }
  },
  methods: {
    onAction() {
      console.log('onAction')
    },
    categoryEdit(id = null) {
      //console.log('edit', id)
      this.$store.dispatch('setStateValue', {
        key: 'categoryEditing',
        value: id
      })
      this.$store.dispatch('toggleModalEditCategory')
      this.modalComp = 'categoryEdit'
      this.modalAction = true
    },
    modalClose() {
      this.modalAction = false
    }
  }
}
</script>

<style></style>
