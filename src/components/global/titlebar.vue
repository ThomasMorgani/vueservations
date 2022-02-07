<template>
  <v-app-bar color="primary" app dark clipped-right>
    <v-toolbar-title class="flex-grow-1">{{ appTitle() }}</v-toolbar-title>
    <v-toolbar-items class="flex-shrink-1">
      <v-tabs
        optional
        right
        background-color="primary"
        slider-color="secondary"
        shrink
      >
        <!-- TODO: MOVE TO DATA OBJECT, V-for over -->
        <v-tab v-for="item in items" :key="item.value" :to="item.to">
          <BtnWithTooltip v-bind="item"></BtnWithTooltip>
        </v-tab>
      </v-tabs>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'titlebarApp',
  computed: {
    ...mapState({
      appSettings: state => state.appSettings
    }),
    items() {
      return [
        {
          btnClass: ['mx-2'],
          to: { name: 'Catalog' },
          iconProps: { color: 'secondary', icon: 'mdi-layers' },
          btnProps: { icon: true },
          tooltipProps: { color: 'primary', disabled: false, bottom: true },
          tooltipText: 'Item Catalog',
          value: 'Catalog'
        },
        {
          btnClass: ['mx-2'],
          to: { name: 'Calendar' },
          iconProps: { color: 'secondary', icon: 'mdi-calendar' },
          btnProps: { icon: true },
          tooltipProps: { color: 'primary', disabled: false, bottom: true },
          tooltipText: 'Reservations',
          value: 'Calendar'
        }
      ]
    }
  },
  methods: {
    appTitle() {
      const setting = this?.appSettings?.find(s => s.name === 'App_Name')
      return setting?.setting || 'VUESERVATIONS'
    }
  }
}
</script>
