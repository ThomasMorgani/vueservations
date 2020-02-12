<template>
  <v-card color="grey lighten-4" min-width="350px" flat>
    <v-toolbar :color="event.class.color" dark>
      <v-toolbar-title v-html="event.title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('deleteEvent', event.id)">
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
      <v-btn icon @click="$emit('editEvent', event.id)">
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <!-- <span v-html="event.details"></!-->
      <template v-for="(details, detail) in event.details">
        <span :key="detail">
          <p class="mb-0">
            <strong>{{ detail }}:</strong>
            {{ details }}
          </p>
        </span>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn text :color="event.class.color" @click="$emit('closeDetails')"
        >CLOSE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'eventDetails',
  props: {
    event: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped></style>
