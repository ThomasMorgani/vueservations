<template>
  <v-card flat>
    <v-card-title>
      <span class="headline font-weight-medium primary--text">CATEGORIES</span>
      <v-spacer></v-spacer>
      <template v-if="catalogView === 'overview'">
        <v-btn text icon color="primary" @click="selectNone">
          <v-icon>mdi-select</v-icon>
        </v-btn>
        <v-btn text icon color="primary" @click="selectAll">
          <v-icon>mdi-select-group</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text icon color="primary" v-on="on" @click="categoryAdd">
              <v-icon left v-text="'mdi-plus-thick'"></v-icon>
            </v-btn>
          </template>
          <span>Add New Category</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn text icon color="warning" v-on="on" @click="setMode('edit')">
              <v-icon v-text="mode === 'edit' ? 'mdi-pencil-off' : 'mdi-pencil'"></v-icon>
            </v-btn>
          </template>
          <span>Toggle Edit Mode</span>
        </v-tooltip>
      </template>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item-group
          v-model="categorySelect"
          :multiple="catalogView === 'overview'"
          color="primary"
          :key="'ig' + catalogView"
          :style="styleCategoryList"
        >
          <v-list-item v-for="(category, i) in categoryList" :key="i">
            <v-list-item-avatar :color="category.color"></v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="category.name"
                class="headline text-capitalize primary--text"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                text
                icon
                :color="modeIcons[mode].color"
                v-if="mode"
                @click="action(modeIcons[mode].action, category.id)"
              >
                <v-icon v-text="modeIcons[mode].icon"></v-icon>
              </v-btn>
              <div v-else>
                <v-tooltip top v-if="category.id == defaultCategory.id">
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" class="align-end">mdi-star-box</v-icon>
                  </template>
                  <span>This is the default category.</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <span v-on="on" class="mb-0 title">({{ categoryCounts[category.id] || 0 }})</span>
                  </template>
                  <span
                    v-text="
                      countText(categoryCounts[category.id] || 0, category.name)
                    "
                  ></span>
                </v-tooltip>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters'

export default {
  data: () => ({
    mode: null,
    modeIcons: {
      delete: {
        action: 'delete',
        icon: 'mdi-trash-can',
        color: 'error'
      },
      edit: {
        action: 'edit',
        icon: 'mdi-pencil',
        color: 'warning'
      },
      search: {
        action: 'details',
        icon: 'mdi-information-outline',
        color: 'primary'
      }
    }
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      catalogView: state => state.catalogView,
      categories: state => state.categories,
      filterCategorySelect: state => state.eventsFilterCategorySelect,
      settings: state => state.settings
    }),
    categoryList() {
      let list = this.categories
      return list.sort((a, b) => a.name.localeCompare(b.name))
    },
    categoryCounts() {
      let counts = {}
      if (this.catalogItems) {
        this.catalogItems.forEach(item => {
          counts[item.category] = counts[item.category]
            ? counts[item.category] + 1
            : 1
        })
      }
      return counts
    },
    categorySelect: {
      get() {
        return this.filterCategorySelect
      },
      set(val) {
        this.$store.commit('eventsFilterCategorySelect', val)
      }
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
    styleCategoryList() {
      let height = this.$store.state.content.main.y || null
      if (height) {
        height = height - 260
      }
      return {
        height: `${height}px`,
        'overflow-y': 'auto'
      }
    }
  },
  methods: {
    action(action, id) {
      switch (action) {
        case 'details':
          this.details(id)
          break
        case 'edit':
          this.edit(id)
          break
        default:
          break
      }
    },
    categoryAdd() {
      this.editCategoryModal = true
      console.log('categoryAdd')
      this.$store.dispatch('categoryEdit', null)
      this.$store.dispatch('toggleModalEditCategory')
    },
    countText(count, category) {
      if (count === 1) {
        return 'There is 1 item under ' + category
      } else if (count === 0) {
        return 'There are no items under ' + category
      } else {
        return 'There are ' + count + ' items under ' + category
      }
    },
    details(id) {
      console.log('details', id)
    },
    edit(id) {
      console.log('edit', id)
      this.$store.dispatch('categoryEdit', id)
      this.$store.dispatch('toggleModalEditCategory')
    },
    selectAll() {
      this.categorySelect = [...this.categories.keys()]
    },
    selectNone() {
      this.categorySelect = []
    },
    setMode(mode) {
      this.mode = this.mode === mode ? null : mode
    }
  },
  created() {
    console.log('category list created')
    //set category filter back to array if overview to statisfy multiselect requirement
    if (!Array.isArray(this.categorySelect)) {
      this.categorySelect = []
    }
  }
}
</script>

<style>
</style>
