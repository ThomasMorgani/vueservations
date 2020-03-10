<template>
  <v-card>
    <v-card-title class="title justify-center primary--text"
      >NOTES</v-card-title
    >
    <v-card-title class="title primary--text pt-0">
      {{ catalogItem.name }}
      <v-chip
        label
        small
        :color="catalogItem.color ? catalogItem.color : 'grey'"
        v-text="catalogItem.abbreviation"
        class="font-weight-bold white--text mx-2"
      ></v-chip>
    </v-card-title>
    <v-card-text>
      <tableSimple v-bind="tableData"></tableSimple>
    </v-card-text>
    <v-card-actions>
      <v-btn text color="primary" @click="modalEditNote = true">ADD</v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
    <v-dialog v-model="modalEditNote" persistent max-width="500">
      <editNote
        :key="modalEditNote"
        @close="modalEditNote = false"
        @saveNote="onSaveNote"
      ></editNote>
    </v-dialog>
  </v-card>
</template>

<script>
// import filters from '@/modules/filters.js'
import tableSimple from '@/components/global/tableSimple'
export default {
  name: 'eventTableSimple',
  components: {
    editNote: () => import('@/components/catalog/catalogItem/ciNoteEdit'),
    tableSimple
  },
  props: {
    tableData: {
      type: Object,
      required: true
    },
    catalogItem: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    modalEditNote: false
  }),
  methods: {
    onSaveNote(note) {
      console.log('onSaveNote')
      console.log(note)
      console.log(this.catalogItem)
      const ciIndex = this.$store.state.catalogItems.findIndex(
        ci => ci.id == this.catalogItem.id
      )
      console.log(ciIndex)
      if (note.isNew) {
        this.tableData.items.push(note.note)
        this.catalogItem.notes.push(note.note)
        // this.$store.dispatch('setStateValueByKey', {
        //   isPush: true,
        //   key: ciIndex,
        //   stateItem: 'catalogItems',
        //   value: note.note
        // })
      } else {
        console.log('update')
      }

      this.modalEditNote = false
      // if (note.isNew) {
      //   this.$store.dispatch('setStateValue', {
      //     isPush: true,
      //     key:
      //   })
      // }
    }
  }
}
</script>

<style></style>
