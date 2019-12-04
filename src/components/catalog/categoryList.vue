<template>
  <v-card>
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
        <!-- <v-btn text icon color="error" @click="setMode('delete')" class="mr-4">
          <v-icon
            v-text="mode === 'delete' ? 'mdi-delete-off' : 'mdi-trash-can'"
          ></v-icon>
        </v-btn> -->
        <v-btn text icon color="warning" @click="setMode('edit')">
          <v-icon
            v-text="mode === 'edit' ? 'mdi-pencil-off' : 'mdi-pencil'"
          ></v-icon>
        </v-btn>
      </template>
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item-group
          v-model="categorySelect"
          :multiple="catalogView === 'overview'"
          color="primary"
          :key="'ig' + catalogView"
        >
          <v-list-item v-for="(category, i) in categoryList" :key="i">
            <v-list-item-avatar :color="category.color"> </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-text="category.name"
                class="headline text-capitalize primary--text"
              ></v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="catalogView !== 'overview'">
              <v-btn
                text
                icon
                :color="modeIcons[mode].color"
                v-if="mode"
                @click="action(modeIcons[mode].action, category.id)"
              >
                <v-icon v-text="modeIcons[mode].icon"></v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data: () => ({
    mode: 'search',
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
      catalogView: state => state.catalogView,
      categories: state => state.categories,
      filterCategorySelect: state => state.eventsFilterCategorySelect
    }),
    categoryList() {
      let list = this.categories;
      return list.sort((a, b) => a.name.localeCompare(b.name));
    },
    categorySelect: {
      get() {
        return this.filterCategorySelect;
      },
      set(val) {
        this.$store.commit('eventsFilterCategorySelect', val);
      }
    }
  },
  methods: {
    action(action, id) {
      switch (action) {
        case 'details':
          this.details(id);
          break;
        case 'edit':
          this.edit(id);
          break;
        default:
          break;
      }
    },
    details(id) {
      console.log('details', id);
    },
    edit(id) {
      console.log('edit', id);
      this.$store.dispatch('categoryEdit', id);
      this.$store.dispatch('toggleModalEditCategory');
    },
    selectAll() {
      this.categorySelect = [...this.categories.keys()];
    },
    selectNone() {
      this.categorySelect = [];
    },
    setMode(mode) {
      this.mode = this.mode === mode ? 'search' : mode;
    }
  },
  created() {
    console.log('category list created');
    //set category filter back to array if overview to statisfy multiselect requirement
    if (!Array.isArray(this.categorySelect)) {
      this.categorySelect = [];
    }
  }
};
</script>

<style></style>
