<template>
  <v-card color="grey lighten-4" flat min-width="300">
    <v-toolbar :color="event.details.color" dark>
      <v-toolbar-title v-html="event.details.title" class="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="white" @click="$emit('closeDetails')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-row dense v-for="(details, detail) in event.fields" :key="detail" align="center">
        <v-col class="subtitle-1 primary--text font-weight-bold text-no-wrap">
          {{
          detail
          }}
        </v-col>
        <v-col class="text-no-wrap">{{ details}}</v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn icon color="error" @click="$emit('deleteEvent', event.id)">
        <v-icon>mdi-delete-forever</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon color="warning" @click="$emit('editEvent', event.id)">
        <v-icon>mdi-square-edit-outline</v-icon>
      </v-btn>
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

<style scoped>
.v-application .subtitle-1 {
  line-height: 1em !important;
}
.v-card__text {
  line-height: 1em !important;
}
</style>
