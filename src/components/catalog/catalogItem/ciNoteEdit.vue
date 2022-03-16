<template>
  <v-card tile>
    <v-card-title class="justify-center title primary--text"
      >EDIT NOTE</v-card-title
    >
    <v-card-text>
      <v-textarea v-model="note" outlined color="primary"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="warning"
        :disabled="!isChanged"
        @click="note = originalNote"
        >RESET</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn text color="warning" @click="close">CANCEL</v-btn>
      <v-btn
        text
        color="success"
        :disabled="!isChanged"
        :loading="saveLoading"
        @click="saveNote"
        >SAVE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import * as formats from '@/modules/formats.js'

export default {
  props: {
    catalogItem: {
      type: Object,
      required: true
    },
    noteEditing: {
      type: Object,
      required: false
    }
  },
  data: () => ({
    id: null,
    note: null,
    originalNote: null,
    saveLoading: false
  }),
  computed: {
    isChanged() {
      return this.note != this.originalNote
    }
  },
  methods: {
    close() {
      this.id = null
      this.note = null
      this.originalNote = null
      this.saveLoading = null
      this.$emit('close')
    },
    noteFormatted() {
      return {
        id: this.id,
        item_id: this.catalogItem.id,
        note: this.note
      }
    },
    saveNote() {
      this.saveLoading = true
      const isNew = this.id === null
      const now = new Date()
      const nowTimestamp = formats.timestampHuman(now, true, false)
      const noteData = {
        id: isNew ? now.getTime() : this.id,
        note: this.note,
        date_created: isNew ? nowTimestamp : this.noteEditing.date_created,
        date_updated: nowTimestamp
      }
      this.$emit('saveNote', {
        isNew: isNew,
        note: noteData
      })
      this.close()
    }
  },
  mounted() {
    if (this.noteEditing) {
      this.id = this.noteEditing.id || null
      this.note = this.noteEditing.note || null
      this.originalNote = this.noteEditing.note || null
    }
  }
}
</script>

<style></style>
