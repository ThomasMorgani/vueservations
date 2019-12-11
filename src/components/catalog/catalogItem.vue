<template>
  <v-expansion-panel @change="isActive = !isActive">
    <v-expansion-panel-header class="pa-2">
      <v-row dense justify-start>
        <v-col cols="2" align-self="center">
          <v-img
            :src="thumbnailSrc ? thumbnailSrc : null"
            contain
            :max-height="thumbnailMaxHeight"
          ></v-img>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <v-chip
              label
              small
              v-html="item.abbreviation"
              class="font-weight-bold ma-2"
            >
            </v-chip>

            <a v-html="item.name" class="font-weight-medium title"></a>
          </v-row>

          <v-row dense class="display-flex align-start justify-start">
            <v-col class="text-xs-left ">
              <p
                v-html="item.categoryName"
                class="font-weight-light font-italic subheading text-capitalize"
                style="display: inline;"
              ></p
            ></v-col>
          </v-row>
          <v-row dense class="display-flex align-start justify-start">
            <v-col class="text-xs-left">
              <p
                class="caption body-1 pa-2"
                :class="!isActive ? '' : ''"
                v-html="item.description"
              ></p>
            </v-col>
          </v-row>
          <v-row dense align="center" justify="start">
            <!-- STATUS enabled, disabled, blocked, unk-->
            <v-card flat class="d-flex align-center text-left grow">
              <v-icon
                :color="
                  statusData[item.status].color || statusData.unknown.color
                "
                v-text="statusData[item.status].icon || statusData.unknown.icon"
              ></v-icon>
              <p
                v-text="statusData[item.status].text"
                :class="
                  ` ml-1 font-weight-bold ${statusData[item.status].color ||
                    statusData.unknown.color}--text`
                "
              ></p>
            </v-card>
            <!-- CHECKOUT STATUS available, reserved, disabled-->
            <v-card flat class="d-flex align-center text-left grow">
              <v-icon
                :color="statusData.available.color || statusData.unknown.color"
                v-text="statusData.available.icon || statusData.unknown.icon"
              ></v-icon>
              <p
                v-text="statusData.available.text"
                :class="
                  ` ml-1 font-weight-bold ${statusData.available.color ||
                    statusData.unknown.color}--text`
                "
              ></p>
            </v-card>
            <!-- LAST CHECKOUT date, never-->
            <v-card flat class="d-flex align-center text-left grow">
              <v-icon color="primary" v-text="'mdi-history'"></v-icon>
              <p
                v-text="'10/21/2019'"
                class="ml-1 font-weight-bold primary--text"
              ></p>
            </v-card>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense justify-start>
        <v-col cols="2" align-self="center"> </v-col>
        <v-col cols="10" align-self="center">
          <v-divider></v-divider>

          <v-row justify-space-between>
            <v-col>
              <p class="title font-weight-bold primary--text">DETAILS</p>
            </v-col>

            <v-col class="text-right">
              <v-btn text icon color="warning" @click="edit">
                <v-icon color="warning">mdi-pencil</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" text-center>
              <template v-if="item.customFields">
                CUSTOM FIELDS HERE
              </template>
              <template v-else>
                NO FIELDS
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
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
    statusData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    isActive: false,
    loading: null
  }),
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
  },
  methods: {
    edit() {
      console.log('edit', this.item);
      this.$store.dispatch('catalogitemEditting', this.item);
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogitemEdit');
      }, 500);
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
