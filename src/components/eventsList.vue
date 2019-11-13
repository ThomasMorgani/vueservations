<template></template>

<script>
import eventListItem from '@/components/evenListItem'
export default {
  props: {
    eventList: {
      type: Array,
      required: true,
      default: []
    }
  },
  components: {
    eventListItem
  }

}
</script>

<style>

</style>