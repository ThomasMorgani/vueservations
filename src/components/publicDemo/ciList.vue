<template>
  <v-card flat>
    <v-card-text class="px-0 text-center">
      <p v-if="items.length < 1">No results found</p>
      <v-expansion-panels v-else popout v-model="panel" class="py-1">
        <transition-group name="flip-list" mode="out-in" style="width: 100%">
          <catalogItem
            v-for="item in orderBy(items, 'name')"
            :key="item.id"
            :item="item"
            :categoriesById="categoriesById"
            @showImage="onShowImage"
            @checkAvailability="onCheckAvailability"
          ></catalogItem>
        </transition-group>
      </v-expansion-panels>
    </v-card-text>
    <v-dialog
      v-model="modal"
      :max-width="modalComp === 'imagePreviewModal' ? '500px' : '600px'"
      :persistent="modalComp !== 'imagePreviewModal'"
      transition="dialog-transition"
    >
      <component
        :key="modal + modalComp"
        :is="modalComp"
        v-bind="modalCompData"
        @close="onModalClose"
      ></component>
    </v-dialog>
  </v-card>
</template>

<script>
import Vue2Filters from 'vue2-filters'

import catalogItem from '@/components/publicDemo/catalogItem'
import ciAvailability from '@/components/publicDemo//ciAvailability'
import imagePreviewModal from '@/components/publicDemo//imagePreviewModal'

export default {
  name: 'catalogList',
  components: {
    catalogItem,
    ciAvailability,
    imagePreviewModal
  },
  props: {
    categories: {
      type: Array,
      required: true
    },
    categoriesById: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    modal: false,
    modalComp: null,
    modalCompData: null,
    panel: null
  }),
  computed: {},
  methods: {
    onCheckAvailability(item) {
      this.modalComp = 'ciAvailability'
      this.modalCompData = { categoriesById: this.categoriesById, item }
      this.modal = true
    },
    onModalClose() {
      this.modal = false
    },
    onShowImage(ciImage) {
      this.modalCompData = { image: { src: ciImage.src } }
      this.modalComp = 'imagePreviewModal'
      this.modal = true
      console.log('show image')
      console.log(ciImage)
    }
  }
}
</script>

<style scoped>
>>> .v-toolbar {
  z-index: 9;
}
>>> .v-expansion-panel {
  max-width: 99%;
}

.v-expansion-panels--popout > .v-expansion-panel {
  max-width: 99%;
}

.flip-list-move {
  transition: transform 1s;
}
</style>
