<template>
  <v-expansion-panel ref="panel">
    <v-expansion-panel-header class="pa-2">
      <v-row dense align="center" justify="center">
        <v-col cols="2" align-self="center" class="d-flex justify-center">
          <v-img
            contain
            :src="thumbnailSrc"
            :max-width="$vuetify.breakpoint.smAndDown ? 75 : 100"
            :max-height="$vuetify.breakpoint.smAndDown ? 75 : 100"
            @click.stop="$emit('showImage', item.image_data)"
            class="pa-0"
          ></v-img>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text">
              {{ item.name }}
            </span>
          </v-row>
          <v-row dense class="display-flex align-center justify-start">
            <v-tooltip top>
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
          <v-row dense class="display-flex align-start justify-start my-2">
            <v-col class="text-xs-left">
              <p class="caption body-1 pa-2" v-html="item.description"></p>
            </v-col>
          </v-row>
          <v-row dense align="center" justify="start" class="my-2">
            <v-col cols="12">
              <v-btn color="primary" text @click.stop="checkAvailability"
                ><v-icon left> mdi-calendar-search </v-icon>Check
                availability</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row justify="start">
        <v-col cols="10" offset="2" class="text-left">
          <p class="title font-weight-bold primary--text">DETAILS</p>
        </v-col>
        <v-col cols="8" offset="2" class="text-center">
          <customFieldsList :items="item.customFields"></customFieldsList>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import customFieldsList from '@/components/publicDemo//ciCustomFieldsList'

export default {
  name: 'catalogItem',
  components: { customFieldsList },
  props: {
    item: {
      type: Object,
      required: true
    },
    categoriesById: {
      type: Object,
      required: true
    }
  },
  computed: {
    thumbnailSrc() {
      return this.item.image_data.src
    },
    thumbnailMaxHeight() {
      return 50
    }
  },
  methods: {
    checkAvailability() {
      this.$emit('checkAvailability', this.item)
    }
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
.v-application p {
  margin-bottom: 0px;
}
</style>
