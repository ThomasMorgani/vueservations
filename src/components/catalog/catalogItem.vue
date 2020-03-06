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
            class="pa-0"
          ></v-img>
        </v-col>
        <v-col cols="10">
          <v-row dense class="display-flex align-center justify-start">
            <!-- <a v-html="item.name" class="font-weight-medium title"></a> -->
            <span class="font-weight-medium title primary--text">{{
              item.name
            }}</span>
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

          <v-row dense class="display-flex align-center justify-start">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-avatar
                    size="10"
                    :color="categoriesById[item.category].color"
                    class="mr-1"
                  >
                  </v-avatar>
                  <p
                    v-html="item.categoryName"
                    class=" font-italic subheading text-capitalize"
                    style="display: inline;"
                  ></p>
                </div>
              </template>
              <span>
                <p class="mb-1"><strong>Category</strong></p>
                <v-avatar
                  size="15"
                  :color="categoriesById[item.category].color"
                  class="mr-1"
                >
                </v-avatar
                >{{ item.categoryName }}
              </span>
            </v-tooltip>
          </v-row>
          <v-row dense class="display-flex align-start justify-start my-2">
            <v-col class="text-xs-left">
              <p class="caption body-1 pa-2" v-html="item.description"></p>
            </v-col>
          </v-row>
          <v-row dense align="center" justify="start" class="my-2">
            <!-- STATUS -->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  :color="status.color"
                  class="mr-3"
                  v-on="on"
                  @click.stop="reserve(item)"
                >
                  <v-icon left v-text="status.icon"></v-icon>
                  {{ status.text }}
                  <!-- <p v-text="status.text" :class="` ml-1 font-weight-bold ${status.color}--text`"></p> -->
                </v-btn>
              </template>
              <span v-html="status.popovertext"></span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-card
                  flat
                  class="d-flex align-center text-left mx-3"
                  v-on="on"
                >
                  <v-icon color="primary" v-text="'mdi-history'"></v-icon>
                  <p
                    v-text="
                      item.lastReservation
                        ? formatDate(
                            item.lastReservation.start_date,
                            true,
                            false
                          )
                        : 'N/A'
                    "
                    class="ml-1 font-weight-bold primary--text"
                  ></p>
                </v-card>
              </template>
              <span v-html="lastReservedText()"></span>
            </v-tooltip>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row dense justify="end">
        <v-col class="flex-grow-1 flex-shrink-0"></v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn text icon color="primary" @click="edit" v-on="on">
                <v-icon color="primary">mdi-note-text-outline</v-icon>
              </v-btn>
            </template>
            <span>Notes</span>
          </v-tooltip>
        </v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn text icon @click="showReservations" v-on="on">
                <v-icon color="primary">mdi-calendar-clock</v-icon>
              </v-btn>
            </template>
            <span>View Reservations</span>
          </v-tooltip>
        </v-col>
        <v-col class="text-right flex-grow-0 flex-shrink-1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn text icon color="warning" @click="edit" v-on="on">
                <v-icon color="warning">mdi-square-edit-outline</v-icon>
              </v-btn>
            </template>
            <span>Edit Item</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="10">
          <v-divider></v-divider>
          <p class="title font-weight-bold primary--text">DETAILS</p>
        </v-col>
        <v-col cols="10" text-center>
          <customFieldsList :items="item.customFields"></customFieldsList>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { timestampHuman } from '@/modules/formats.js'

import customFieldsList from '@/components/catalog/catalogItemCustomFieldsList'
export default {
  name: 'catalogItem',
  components: {
    customFieldsList
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['categoriesById']),
    ...mapState({
      categories: state => state.categories,
      statusData: state => state.statusData
    }),
    isReserved() {
      let reserved = false
      if (this.item.lastReservation) {
        const now = new Date()
        const endDate = new Date(this.item.lastReservation.end_date)
        if (endDate < now) {
          reserved = this.isReservedText()
        }
      }
      return reserved
    },
    status() {
      let data
      if (this.item.isAvailable) {
        data = this.statusData.enabled

        switch (this.item.status) {
          case 'blocked':
            data = this.statusData.blocked
            break
          case 'enabled':
            data = this.statusData.available

            break
          case 'disabled':
            data = this.statusData.disabled
            break
          default:
            data = this.statusData.unkown
            break
        }
      } else {
        data = {
          ...this.statusData.unavailable,
          popovertext: this.isReservedText()
        }
      }
      return data
    },
    thumbnailSrc() {
      return this.item.image_data.src
      // return 'https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png'
    },
    thumbnailMaxHeight() {
      return 50
      // return this.thumbnailSrc ===
      //   'https://www.eipl.org/newsite/static/images/generic/music_cd_art_not_found.png'
      //   ? 50
      //   : 100
    }
  },
  methods: {
    edit() {
      console.log('edit', this.item)
      this.$store.dispatch('setStateValue', {
        key: 'catalogitemediting',
        value: { ...this.item }
      })
      setTimeout(() => {
        this.$store.dispatch('toggleModalCatalogitemEdit')
      }, 500)
    },
    isReservedText() {
      //merge this with last reservaiton method?
      const resData = this.item.lastReservation
      let wYear =
        resData.start_date.substring(0, 4) !== resData.end_date.substring(0, 4)
      let dateStart = this.formatDate(resData.start_date, wYear, true)
      let dateEnd = this.formatDate(resData.end_date, wYear, true)
      let text = `<p class="mb-1"><strong>${resData.patronData['last_name']}, ${resData.patronData['first_name']}</strong></p><p class="mb-1">${dateStart} - ${dateEnd}</p>`
      // let text = `<p class="mb-1"><strong>${resData.patronData.last_name}, ${resData.patronData.first_name}</strong></p><p class="mb-1">${dateStart} - ${dateEnd}</p>`
      return text
    },
    formatDate(timestamp, withYear, withTime) {
      return timestampHuman(timestamp, withYear, withTime)
    },
    lastReservedText() {
      //merge this with last reservaiton method?
      return `<p class="mb-1"><strong>Last Reservation:</strong></p><p class="mb-1">${
        this.item.lastReservation ? this.isReservedText() : 'None'
      }</p>`
    },
    reserve(e) {
      if (this.item.status !== 'enabled') {
        this.$store.dispatch('setStateValue', {
          key: 'snackbarData',
          value: {
            status: 'error',
            message: `${this.item.status.toUpperCase()} items can't be reserved.`
          }
        })
        this.$store.dispatch('toggleStateValue', 'snackbarState')
      } else {
        if (this.item.isAvailable) {
          this.$emit('reserve', e)
        }
      }
    },
    showReservations() {
      this.$emit('showItemReservations', this.item)
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
