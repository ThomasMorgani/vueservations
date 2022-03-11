<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="10" md="8" lg="7">
      <v-card flat>
        <v-card-text class="text-center primary--text font-weight-bold">
          <p class="mb-0">
            Add Vueservations widget to public facing site to allow online
            reservations.
          </p>
          <p class="text-caption">(demo disabled)</p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="10" md="8" lg="7">
      <v-card class="d-flex flex-column justify-start">
        <v-card-text class="pt-6">
          <v-text-field
            solo
            rounded
            clearable
            prepend-inner-icon="mdi-magnify"
            placeholder="Search"
            color="primary"
            class="flex-grow-0 flex-shrink-1"
            v-model="filterSearch"
          ></v-text-field>
          <!--CATEGORY SELECT -->
          <v-select
            v-model="filterCategory"
            :items="orderBy(categoriesAvailable, 'name')"
            item-text="name"
            item-value="id"
            label="Category"
            attach="#mm"
            multiple
            :menu-props="{
              absolute: true,
              bottom: true,
              'min-width': '100%'
            }"
            chips
            full-width
            deletable-chips
            no-hint
            no-title
            clearable
            color="primary"
            class="pt-0"
          >
            <!--CATEGORY SELECT ITEM -->
            <template v-slot:item="{ item }">
              <v-list-item-icon>
                <v-icon
                  v-text="
                    filterCategory.includes(item.id)
                      ? 'mdi-checkbox-marked'
                      : 'mdi-checkbox-blank-outline'
                  "
                ></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon
                  :color="item.color"
                  v-text="'mdi-checkbox-blank-circle'"
                ></v-icon>
              </v-list-item-action>
            </template>
            <template v-slot:selection="{ item }">
              <v-chip
                :color="item.color"
                close
                @click:close="
                  filterCategory = filterCategory.filter(i => i !== item.id)
                "
                class="white--text font-weight-bold"
              >
                <span>{{ item.name }}</span>
              </v-chip>
            </template>
          </v-select>
          <v-sheet id="mm" height="10" width="100%"></v-sheet>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="11" lg="8" class="text-center">
      <v-progress-circular
        v-if="isLoading"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <ciList
        v-else
        :items="itemList"
        :categories="categories"
        :categoriesById="categoriesById"
      ></ciList>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'

// import btnWithTooltip from '@/components/btnWithTooltip'
import ciList from '@/components/publicDemo/ciList'
import Vue2Filters from 'vue2-filters'
import filters from '@/modules/filters'
import * as formats from '@/modules/formats.js'

export default {
  name: 'App',
  components: {
    // btnWithTooltip
    ciList
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    isLoading: true,
    filterCategory: [],
    filterSearch: null
  }),
  computed: {
    ...mapState({
      categories: state => state.categories,
      events: state => state.events,
      items: state => state.catalogItems
    }),
    categoriesAvailable() {
      const categories = []
      this.items.forEach(i => categories.push(i.category))
      return [...new Set(categories)].map(c => this.categoriesById[c])
    },
    categoriesById() {
      const categories = {}
      this.categories.forEach(cat => {
        categories[cat.id] = cat
      })
      return categories
    },
    itemList() {
      let cItemsFiltered = []
      // this.items.forEach(ci => {
      //   cItemsFiltered.push(this.formatCatalogItemData(ci))
      // })
      const filterNames = [
        'filterCategory',
        // 'filterRangeDate',
        'filterSearch'
      ]
      let filtersSet = {}
      filterNames.forEach(f =>
        this[f] && this[f].length > 0 ? (filtersSet[f] = this[f]) : null
      )

      if (Array.isArray(this.items)) {
        this.items.forEach(ci => {
          cItemsFiltered.push(this.formatCatalogItemData(ci))
        })
      }

      if (Object.keys(filtersSet).length > 0) {
        //   if (filtersSet.filterAvailability) {
        //     cItemsFiltered = cItemsFiltered.filter(ci =>
        //       filtersSet.filterAvailability === 'available'
        //         ? ci.isAvailable
        //         : !ci.isAvailable
        //     )
        //   }
        if (filtersSet.filterCategory) {
          cItemsFiltered = cItemsFiltered.filter(ci =>
            filtersSet.filterCategory.includes(ci.category)
          )
        }

        //   if (filtersSet.filterStatus) {
        //     cItemsFiltered = cItemsFiltered.filter(ci =>
        //       filtersSet.filterStatus.includes(ci.status.toUpperCase())
        //     )
        //   }

        if (filtersSet.filterSearch) {
          const possibleKeys = [
            'abbreviation',
            'categoryName',
            'description',
            'name',
            'status'
          ]
          cItemsFiltered = cItemsFiltered.filter(ci => {
            return filters.findStringMatchesInObj(
              ci,
              possibleKeys,
              filtersSet.filterSearch
            )
          })
        }
      }

      // if (filtersSet.filterVisibility) {
      //   cItemsFiltered = cItemsFiltered.filter(
      //     ci => ci.internal === filtersSet.filterVisibility
      //   )
      // }
      // return cItemsFiltered

      return cItemsFiltered
    }
  },
  methods: {
    formatCatalogItemData(catalogItem) {
      //format data to be passed to list item
      if (catalogItem && catalogItem.name) {
        const category = filters.categoryById(
          catalogItem.category,
          this.categories
        )
        catalogItem.categoryName = category.name || 'MISC'
        if (catalogItem.lastReservation && catalogItem.lastReservation['0']) {
          let now = new Date()
          catalogItem.isAvailable = !filters.testRangeOverlap(
            catalogItem.lastReservation['0'].start_date,
            catalogItem.lastReservation['0'].end_date,
            now,
            now
          )
        } else {
          catalogItem.isAvailable = true
        }
        return formats.catalogItem(catalogItem)
      } else {
        return formats.catalogItem(catalogItem)
      }
    }
  },
  mounted() {
    setTimeout(() => (this.isLoading = false), 1000)
  }
}
</script>
<style scoped>
>>> .v-menu__content {
  position: absolute;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

.hoverPointer:hover {
  cursor: pointer;
}

.mainView::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: #623fa7;
  border-radius: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(102, 102, 102, 0);
  border-radius: 10px;
}

.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
