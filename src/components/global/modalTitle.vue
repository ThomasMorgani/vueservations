<template>
  <v-card-title
    v-text="text"
    class="justify-center text-h6 font-weight-bold primary secondary--text mb-4"
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
