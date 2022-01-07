<template>
  <v-sheet
    color="transparent"
    v-text="text"
    class="text-h6 primary--text font-weight-bold"
  />
</template>

<script>
export default {
  props: {
    text: {
      required: true,
      type: String
    }
  }
}
</script>
