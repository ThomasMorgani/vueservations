<template>
  <v-card>
    <v-card-title class="title justify-center primary--text"
      >NOTES LOG</v-card-title
    >
    <v-card-text>
      <v-data-table
        :headers="[
          ...tableData.headers,
          { text: '', value: 'action', sortable: false, align: 'right' }
        ]"
        :items="tableData.items"
        fixed-header
        options.sync="paginitation"
        :hide-default-footer="true"
        :height="tableData.height"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title class="headline primary--text">
              {{ catalogItem.name }}
              <v-chip
                label
                small
                :color="catalogItem.color ? catalogItem.color : 'grey'"
                v-text="catalogItem.abbreviation"
                class="font-weight-bold white--text mx-2"
              ></v-chip>
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-menu
            v-model="menuConfDelete"
            :close-on-content-click="false"
            top
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-icon small color="error" class="mx-2" v-on="on">
                mdi-delete
              </v-icon>
            </template>
            <v-card>
              <v-card-title class="title primary--text">
                CONFIRM DELETE
              </v-card-title>
              <v-card-actions>
                <v-btn text color="primary">CANCEL</v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="error" @click="noteDelete(item)"
                  >CONFIRM</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-icon small color="warning" class="mx-2" @click="noteEdit(item)">
            mdi-pencil
          </v-icon>
        </template>
        <template v-slot:no-data>
          NO NOTES
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-dialog v-model="modalEditNote" persistent max-width="500">
        <template v-slot:activator="{ on }">
          <v-btn text color="primary" class="mb-2" v-on="on">+ ADD</v-btn>
        </template>
        <editNote
          :key="modalEditNote"
          :catalogItem="catalogItem"
          :noteEditing="noteEditing"
          @close="onEditNoteClose"
          @saveNote="onSaveNote"
        ></editNote>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ciNotes',
  components: {
    editNote: () => import('@/components/catalog/catalogItem/ciNoteEdit')
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
    modalEditNote: false,
    noteDeleting: null,
    menuConfDelete: null,
    noteEditing: null,
    options: {
      itemsPerPage: 0,
      sortBy: 'date_created'
    }
  }),
  methods: {
    noteAdd(note) {
      this.tableData.items.push(note)
      this.catalogItem.notes.push(note)
      this.saveNotesToLocal()
    },
    noteDelete(note) {
      this.saveLoading = true
      const noteKeyCi = this.catalogItem.notes.findIndex(n => n.id == note.id)
      const noteKeyTi = this.tableData.items.findIndex(n => n.id == note.id)
      this.$delete(this.catalogItem.notes, noteKeyCi)
      this.$delete(this.tableData.items, noteKeyTi)
      this.noteDeletingLoading = null
      this.$store.dispatch('localStorageWrite', {
        key: 'catalogItems',
        data: this.$store.state.catalogItems
      })
    },
    noteEdit(item) {
      this.noteEditing = item
      setTimeout(() => (this.modalEditNote = true), 500)
    },
    noteUpdate(note) {
      const ciNoteKey = this.catalogItem.notes.findIndex(n => n.id == note.id)
      if (ciNoteKey > -1) {
        this.$set(this.catalogItem.notes, ciNoteKey, note)
      }
      const tableItemNoteKey = this.tableData.items.findIndex(
        ti => ti.id == note.id
      )
      this.$set(this.tableData.items, tableItemNoteKey, note)
    },
    onEditNoteClose() {
      this.modalEditNote = false
      this.noteEditing = null
    },
    onSaveNote(note) {
      if (note.isNew) {
        this.noteAdd(note.note)
      } else {
        this.noteUpdate(note.note)
      }
      this.$store.dispatch('localStorageWrite', {
        key: 'catalogItems',
        data: this.$store.state.catalogItems
      })
      this.modalEditNote = false
    }
  }
}
</script>

<style></style>
