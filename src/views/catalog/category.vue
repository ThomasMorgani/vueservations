<template>
  <v-card flat>
    <v-card-title
      class="title primary--text font-weight-bold d-flex align-center pb-0"
    >
      CATEGORIES
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        name="Search"
        label="Search"
        outlined
        dense
        clearable
        prepend-inner-icon="mdi-feature-search"
        hide-details
        color="primary"
      ></v-text-field>
      <BtnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-sticker-plus' }"
        :tooltipProps="{ disabled: false, color: 'primary', top: true }"
        :tooltipText="'Add Category'"
        @click="categoryEdit"
      ></BtnWithTooltip>
    </v-card-title>

    <v-card-text class="pt-0">
      <categoryList
        :categories="categoriesDisplayed"
        @itemClicked="categoryEdit"
      ></categoryList>
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
