<template>
  <v-sheet class="text-center">
    <p class="font-weight-bold primary--text">
      No {{ missingItemName }} found.
    </p>
    <v-btn color="primary" outlined @click="$emit('btnClicked')"
      ><v-icon v-bind="{ left: true, primary: true }">{{ btnIcon }}</v-icon
      >{{ btnText }}</v-btn
    >
  </v-sheet>
</template>

<script>
export default {
  props: {
    missingItemName: {
      type: String,
      default: () => 'items'
    },
    btnIcon: {
      type: String,
      required: true
    },
    btnText: {
      type: String,
      required: true
    }
  }
}
</script>
