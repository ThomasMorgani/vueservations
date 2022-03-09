<template>
  <v-tooltip color="primary" top>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-avatar
          :size="avatarSize"
          :color="eventData.eventStatus.color || ''"
          class="mr-1 ml-5"
        ></v-avatar>
        <p
          v-if="withLabel"
          v-html="eventData.eventStatus.label || ''"
          class="font-italic subheading text-capitalize"
          style="display: inline;"
        ></p>
      </div>
    </template>
    <span>
      {{ eventData.eventStatus.text || '' }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'EventStatus',
  props: {
    avatarSize: {
      type: Number,
      default: () => 10
    },
    eventData: {
      type: Object,
      required: true
    },
    withLabel: {
      type: Boolean,
      default: () => true
    }
  }
}
</script>

<style></style>
