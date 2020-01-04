<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="pa-2">
      <v-row dense justify-start>
        <v-col cols="2" align-self="center">
          <v-img :src="thumbnailSrc ? thumbnailSrc : null" contain :max-height="thumbnailMaxHeight"></v-img>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text">{{item.name}}</span>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-chip
                  label
                  small
                  :color="item.color ? item.color : 'grey'"
                  v-text="item.abbreviation"
                  class="font-weight-bold white--text mx-2"
                  v-on="on"
                ></v-chip>
              </template>
              <span>
                <p>
                  <strong>Abbreviation:</strong>
                  {{item.abbreviation}}
                </p>
                <p>
                  <strong>Color:</strong>
                  {{item.color}}
                </p>
                <div :style="{height: '10px', 'background-color': item.color}"></div>
              </span>
            </v-tooltip>
          </v-row>

          <v-row dense class="display-flex align-start justify-start">
            <v-col class="text-xs-left">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <p
                    v-html="item.categoryName"
                    class="font-weight-light font-italic subheading text-capitalize"
                    style="display: inline;"
                    v-on="on"
                  ></p>
                </template>
                <span>Category</span>
              </v-tooltip>
            </v-col>
          </v-row>
          <v-row dense class="display-flex align-start justify-start">
            <v-col class="text-xs-left">
              <p class="caption body-1 pa-2" v-html="item.description"></p>
            </v-col>
          </v-row>
          <v-row dense align="center" justify="start">
            <!-- STATUS -->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-card flat class="d-flex align-center text-left mr-3" v-on="on">
                  <v-icon :color="status.color
                " v-text="status.icon"></v-icon>
                  <p
                    v-text="status.text"
                    :class="
                  ` ml-1 font-weight-bold ${status.color}--text`
                "
                  ></p>
                </v-card>
              </template>
              <span>{{status.popovertext}}</span>
            </v-tooltip>

            <!-- CHECKOUT STATUS available, reserved, disabled-->
            <!-- <v-card flat class="d-flex align-center text-left grow">
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
            </v-card>-->
            <!-- LAST CHECKOUT date, never-->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-card flat class="d-flex align-center text-left mx-3" v-on="on">
                  <v-icon color="primary" v-text="'mdi-history'"></v-icon>
                  <p v-text="'10/21/2019'" class="ml-1 font-weight-bold primary--text"></p>
                </v-card>
              </template>
              <span>Last Reservation</span>
            </v-tooltip>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense justify-start>
        <v-col cols="2" align-self="center"></v-col>
        <v-col cols="10" align-self="center">
          <v-divider></v-divider>

          <v-row justify-space-between>
            <v-col>
              <p class="title font-weight-bold primary--text">DETAILS</p>
            </v-col>

            <v-col class="text-right">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn text icon color="warning" @click="edit" v-on="on">
                    <v-icon color="warning">mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit Item</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12" text-center>
              <template v-if="item.customFields && item.customFields.length > 0">
                <v-card flat class="d-flex flex-row">
                  <v-card flat class="flex-shrink-1">
                    <v-card
                      v-for="field in item.customFields"
                      :key="field.field_id"
                      class="d-flex flex-row"
                      flat
                    >
                      <p class="font-weight-bold primary--text">{{ field.name }}:</p>
                    </v-card>
                  </v-card>
                  <v-card flat class="flex-shrink-1 px-6">
                    <v-card
                      v-for="field in item.customFields"
                      :key="field.field_id + 'val'"
                      class="d-flex flex-row justify-space-between align-center"
                      flat
                    >
                      <p class="text-left">{{ field.value }}</p>
                      <v-tooltip right>
                        <template v-slot:activator="{ on }">
                          <v-icon
                            small
                            class="text-right ml-6"
                            v-on="on"
                          >{{ field.internal === '1' ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                        </template>
                        <span>{{ field.internal === '1' ? 'Internal use only' : 'Visible to public' }}</span>
                      </v-tooltip>
                    </v-card>
                  </v-card>
                </v-card>
              </template>
              <template v-else>
                <p>No additional details.</p>
                <p>Click the "edit" icon above to modify custom fields.</p>
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'

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

  computed: {
    ...mapState({
      categories: state => state.categories
    }),
    status() {
      const available = true //temp value until implemented
      let data = this.statusData.enabled
      switch (this.item.status) {
        case 'blocked':
          data = this.statusData.blocked
          break
        case 'enabled':
          if (available) {
            data = this.statusData.available
          } else {
            data = this.statusData.available
          }
          break
        case 'disabled':
          data = this.statusData.disabled
          break
        default:
          data = this.statusData.unkown
          break
      }
      return data
    },
    thumbnailSrc() {
      if (this.item.imageLinks) {
        if (
          this.item.imageLinks.thumbnail &&
          typeof this.item.imageLinks.thumbnail === 'string'
        ) {
          return this.item.imageLinks.thumbnail
        }
        if (
          this.item.imageLinks['0'] &&
          typeof this.item.imageLinks['0'] === 'string'
        ) {
          return this.item.imageLinks['0']
        }
      }
      return 'https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png'
    },
    thumbnailMaxHeight() {
      return this.thumbnailSrc ===
        'https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png'
        ? 50
        : 100
    }
  },
  methods: {
    edit() {
      console.log('edit', this.item)
      this.$store.dispatch('catalogitemEditting', this.item)
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogitemEdit')
      }, 500)
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
