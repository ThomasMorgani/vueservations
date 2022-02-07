<template>
  <v-tabs optional left background-color="primary" slider-color="secondary">
    <v-tab>
      <demo-reset-btn :value="true"></demo-reset-btn>
    </v-tab>
    <v-tab
      v-for="item in items"
      :href="'#' + item.value"
      :key="item.value"
      :to="item.to"
      :value="item.value === $route.name"
    >
      <btn-with-tooltip v-bind="item"></btn-with-tooltip>
    </v-tab>
  </v-tabs>
</template>

<script>
import DemoResetBtn from '@/components/demo/DemoResetBtn'

export default {
  name: 'footerApp',
  components: {
    DemoResetBtn
  },
  computed: {
    items() {
      return [
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-monitor-eye' },
          to: { name: 'Public' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Public example',
          value: 'Public'
        }
      ]
    }
  }
}
</script>

<style></style>
