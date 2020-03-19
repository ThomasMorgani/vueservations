<template>
  <v-row
    fill-height
    align-start
    justify="space-between"
    dense
    no-gutters
    class="d-flex flex-column"
  >
    <v-col cols="12" class="pa-0 flex-shrink-1">
      <!-- <v-sheet height="10vh"> -->
      <v-toolbar height="40" flat color="background">
        <v-toolbar-title
          class="title primary--text font-weight-bold d-flex align-center pb-0"
        >
          IMAGES</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-menu bottom>
          <template v-slot:activator="{ on: menu }">
            <v-tooltip top>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn icon v-on="{ ...tooltip, ...menu }"
                  ><v-icon color="primary">{{
                    viewData[view].icon
                  }}</v-icon></v-btn
                >
              </template>
              <span>VIEW</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="viewItem in Object.values(viewData)"
              :key="viewItem.value"
              @click="view = viewItem.value"
            >
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon color="primary" v-on="on">
                    {{ viewItem.icon }}</v-icon
                  >
                </template>
                <span>{{ viewItem.text }}</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-menu>
        <btnWithTooltip
          :btnClass="['mx-4']"
          :btnProps="{ icon: true, color: 'primary' }"
          :iconProps="{ icon: 'mdi-image-plus' }"
          :tooltipProps="{ disabled: false, top: true }"
          :tooltipText="'Add Image'"
          @click="patronAdd()"
        ></btnWithTooltip>
      </v-toolbar>
    </v-col>
    <v-col cols="12" class="pa-0 flex-grow-1">
      <component :is="view" :view="view"></component>
    </v-col>

    <v-dialog
      :value="modalImageFullPreview"
      transition="dialog-transition"
      :key="modalImageFullPreview"
      @input="$store.dispatch('toggleModalImageFullPreview')"
    >
      <imagePreviewModal></imagePreviewModal>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'

export default {
  components: {
    btnWithTooltip,
    imagePreviewModal: () => import('@/components/images/imagePreviewModal'),
    tiles: () => import('@/components/images/imagesTiles')
  },
  data: () => ({
    editCategoryData: {
      id: null,
      color: 'primary',
      name: null
    },
    search: null,
    view: 'tiles',
    viewData: {
      list: {
        icon: 'mdi-format-list-bulleted-square',
        text: 'LIST',
        value: 'list'
      },
      details: {
        icon: 'mdi-card-bulleted-outline',
        text: 'DETAILED',
        value: 'details'
      },

      tiles: {
        icon: 'mdi-view-comfy',
        text: 'TILED',
        value: 'tiles'
      }
    }
  }),
  computed: {
    ...mapState({
      modalImageFullPreview: state => state.modalImageFullPreview
    })
  },
  methods: {},
  created() {
    this.view = localStorage.getItem('lastViewImages')
      ? localStorage.getItem('lastViewImages')
      : 'tiles'
  }
}
</script>

<style></style>
