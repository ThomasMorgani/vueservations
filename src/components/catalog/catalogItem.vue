<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-layout row wrap align-center>
        <v-flex
          xs4
          sm2
          class="align-content-center justify-content-center pa-2"
        >
          <v-img
            :src="thumbnailSrc ? thumbnailSrc : null"
            contain
            :max-height="thumbnailMaxHeight"
          ></v-img>
        </v-flex>
        <v-flex xs8 sm10>
          <v-layout column class="justify-start align-start">
            <v-flex class="text-xs-left font-weight-medium title">
              <a
                @click.native.stop
                target="_blank"
                :href="item.catalogUrl"
                v-html="item.name"
              ></a>
            </v-flex>
            <v-flex class="text-xs-left "
              ><p
                v-html="item.categoryName"
                class="font-weight-light font-italic subheading text-capitalize"
              ></p
            ></v-flex>
            <v-flex class="text-xs-left body-1 pa-2">
              <div
                v-if="item.description"
                class="descFlex caption"
                v-html="
                  isActivePanel
                    ? item.description
                    : item.description.substring(0, 200) + '...'
                "
              ></div>
            </v-flex>
            <!-- <template v-if="item.vuekey === expandedPanel"> -->
            <template v-if="isActivePanel">
              <v-flex class="text-xs-left">
                <font class="font-weight-bold">GENRE:</font>
                <font
                  v-for="(category, catKey) in item.categories"
                  :key="catKey"
                  >{{
                    catKey === item.categories.length - 1
                      ? category
                      : catergory + ','
                  }}</font
                >
              </v-flex>
              <v-flex>
                <font class="font-weight-bold">LENGTH:</font>
                <font>{{ item.length }}</font>
              </v-flex>
              <v-flex>
                <font class="font-weight-bold">PUBLISHING:</font>
                <font>{{ item.publisher }}, {{ item.publishedDate }}</font>
              </v-flex>
            </template>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-expansion-panel-header>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'catalogItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isActivePanel: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    ...mapState({
      categories: state => state.categories
    }),
    thumbnailSrc() {
      if (this.item.imageLinks) {
        if (
          this.item.imageLinks.thumbnail &&
          typeof this.item.imageLinks.thumbnail === 'string'
        ) {
          return this.item.imageLinks.thumbnail;
        }
        if (
          this.item.imageLinks['0'] &&
          typeof this.item.imageLinks['0'] === 'string'
        ) {
          return this.item.imageLinks['0'];
        }
      }
      return 'https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png';
    },
    thumbnailMaxHeight() {
      return this.thumbnailSrc ===
        'https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png'
        ? 50
        : 100;
    }
  }
};
</script>

<style scoped>
p {
  margin-bottom: 0px;
}
.v-application p {
  margin-bottom: 0px;
}
</style>
