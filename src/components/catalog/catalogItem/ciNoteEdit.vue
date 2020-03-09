<template>
  <v-card>
    <v-card-title class="justify-center title primary--text">EDIT NOTE</v-card-title>
    <v-card-text>
      <v-textarea v-model="note" outlined color="primary"></v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        color="primary"
        :disabled="!isChanged"
        :loading="saveLoading"
        @click="note = originalNote"
      >RESET</v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CANCEL</v-btn>
      <v-btn text color="primary" :disabled="!isChanged" @click="saveNote">SAVE</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import * as formats from '@/modules/formats.js'

export default {
  props: {
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
    noteFormatted() {
      return {
        id: this.id,
        note: this.note
      }
    },
    saveNote() {
      console.log('save')
      this.saveLoading = true
      this.$store
        .dispatch('apiCall', {
          endpoint: '/note',
          postData: this.noteFormatted()
        })
        .then(resp => {
          if (resp.status == 'success') {
            //$emit('saveNote', resp.data)
            const isNew = this.id === null
            let now = new Date()
            let nowTimestamp = formats.timestampHuman(now, true, false)
            let noteData = {
              id: isNew ? resp.data.id : this.id,
              note: this.note,
              createdDate: isNew ? nowTimestamp : this.noteEditing.createdDate,
              updatedDate: nowTimestamp
            }
            this.$emit('saveNote', {
              isNew: isNew,
              note: noteData
            })

            console.log(resp)
          }
        })
        .catch(err => console.log(err))
    }
  },
  created() {
    if (this.noteEditing) {
      this.id = this.noteEditing.id || null
      this.originalNote = this.noteEditing.note || null
    }
  }
}
</script>

<style>
</style>