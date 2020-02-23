<template>
  <v-card color="grey lighten-4" flat min-width="300">
    <v-toolbar dark :color="event.details.color" height="50">
      <v-toolbar-title
        v-html="event.details.title"
        class="title"
      ></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon color="white" @click="$emit('closeDetails')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pt-0">
      <v-row dense justify="space-between" class="py-2">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              @click="$emit('showDetails', { type: 'event', event: event })"
              v-on="on"
            >
              <v-icon>mdi-calendar-search</v-icon>
            </v-btn>
          </template>
          <span>Event Details</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              @click="$emit('showDetails', { type: 'ci', event: event })"
              v-on="on"
            >
              <v-icon>mdi-layers-search</v-icon>
            </v-btn>
          </template>
          <span>Catalog item details</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              color="primary"
              @click="$emit('showDetails', { type: 'patron', event: event })"
              v-on="on"
            >
              <v-icon>mdi-account-search</v-icon>
            </v-btn>
          </template>
          <span>Patron Details</span>
        </v-tooltip>
      </v-row>
      <v-row
        dense
        v-for="(details, detail) in event.fields"
        :key="detail"
        align="center"
      >
        <v-col
          cols="4"
          class="subtitle-1 primary--text font-weight-bold text-no-wrap"
        >
          {{ detail }}
        </v-col>
        <v-col class="text-no-wrap text-left font-weight-bold">{{
          details
        }}</v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="error"
            @click="$emit('deleteEvent', event.details.id)"
            v-on="on"
          >
            <v-icon>mdi-delete-forever</v-icon>
          </v-btn>
        </template>
        <span>Delete Event</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="warning"
            @click="$emit('editEvent', event.eventData)"
            v-on="on"
          >
            <v-icon>mdi-square-edit-outline</v-icon>
          </v-btn>
        </template>
        <span>Edit Event</span>
      </v-tooltip>
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
