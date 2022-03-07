<template>
  <v-card flat width="100%">
    <v-row dense class="display-flex align-center justify-start">
      <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
      <span class="font-weight-medium title primary--text">
        {{ item.name }}
      </span>
      <v-tooltip color="primary" top>
        <template v-slot:activator="{ on }">
          <v-chip
            label
            small
            :color="item.color ? item.color : 'grey'"
            :text-color="chipTextColor()"
            v-text="item.abbreviation"
            class="font-weight-bold white--text mx-2"
            v-on="on"
          ></v-chip>
        </template>
        <span>
          <p>
            <strong>Abbreviation:</strong>
            {{ item.abbreviation }}
          </p>
          <p>
            <strong>Color:</strong>
            {{ item.color }}
          </p>
          <div
            :style="{ height: '10px', 'background-color': item.color }"
          ></div>
        </span>
      </v-tooltip>
    </v-row>

    <v-row
      v-if="showCategory"
      dense
      class="display-flex align-center justify-start"
    >
      <v-tooltip color="primary" top>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-avatar
              size="10"
              :color="categoriesById[item.category].color"
              class="mr-1"
            ></v-avatar>
            <p
              v-html="item.categoryName"
              class="font-italic subheading text-capitalize"
              style="display: inline;"
            ></p>
          </div>
        </template>
        <span>
          <p class="mb-1">
            <strong>Category</strong>
          </p>
          <v-avatar
            size="15"
            :color="categoriesById[item.category].color"
            class="mr-1"
          ></v-avatar>
          {{ item.categoryName }}
        </span>
      </v-tooltip>
    </v-row>
  </v-card>
</template>

<script>
import { contrastingColor } from '@/modules/formats.js'
export default {
  name: 'CiHeading',
  props: {
    item: {
      type: Object,
      required: true
    },
    showCategory: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    categoriesById() {
      return this.$store.getters.categoriesById
    }
  },
  methods: {
    chipTextColor() {
      return contrastingColor(this.item.color)
    }
  }
}
</script>

<style lang="scss" scoped></style>
