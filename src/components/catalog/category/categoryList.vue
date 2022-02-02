<template>
  <v-card flat>
    <v-card-text :style="styleCategoryList">
      <v-list>
        <v-list-item
          v-for="(category, i) in categories"
          :key="i"
          :input-value="filterCategory.includes(category.id)"
          active-class="primary lighten-5"
          @click="$emit('itemClicked', category.id)"
        >
          <v-list-item-avatar
            size="20"
            :color="category.color"
          ></v-list-item-avatar>
          <v-list-item-content class="py-2">
            <v-list-item-title class="headline text-capitalize primary--text">
              {{ category.name }}
              <v-tooltip
                v-if="category.id == defaultCategory.id"
                color="primary"
                top
              >
                <template v-slot:activator="{ on }">
                  <v-icon x-small v-on="on" class="mb-4">mdi-star</v-icon>
                </template>
                <span>This is the default category.</span>
              </v-tooltip>
            </v-list-item-title>
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
              <v-tooltip color="primary" top>
                <template v-slot:activator="{ on }">
                  <span v-on="on" class="mb-0 subheading-1"
                    >({{ categoryCounts[category.id] || 0 }})</span
                  >
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
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters'
export default {
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
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

      filterCategory: state => state.filterCategory,
      settings: state => state.appSettings
    }),

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
        this.$store.commit('setStateValue', {
          key: 'filterCategory',
          value: val
        })
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
      return cat || false
    },
    styleCategoryList() {
      let height = this.$store.state.content.main.y || null
      if (height) {
        height = height - 200
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
      return id
    },
    selectAll() {
      this.categoryList.forEach(c =>
        this.$store.dispatch('setStateValue', {
          key: 'filterCategory',
          value: c.id,
          isPush: true
        })
      )
    },
    selectItem(c) {
      if (this.catalogView !== 'category') {
        if (this.filterCategory.includes(c.id)) {
          this.$store.dispatch('setStateValue', {
            key: 'filterCategory',
            value: this.filterCategory.filter(e => e !== c.id)
          })
        } else {
          this.$store.dispatch('setStateValue', {
            key: 'filterCategory',
            value: c.id,
            isPush: true
          })
        }
      }
    },
    selectNone() {
      this.$store.dispatch('setStateValue', {
        key: 'filterCategory',
        value: []
      })
    },
    setMode(mode) {
      this.mode = this.mode === mode ? null : mode
    }
  },
  created() {
    //set category filter back to array if overview to statisfy multiselect requirement
    if (!Array.isArray(this.categorySelect)) {
      this.categorySelect = []
    }
  }
}
</script>

<style></style>
