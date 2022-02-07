<template>
  <v-app-bar color="primary" app dark clipped-right>
    <v-row>
      <v-col align-self="center">
        <v-toolbar-title>{{ appTitle() }}</v-toolbar-title>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4">
        <v-tabs
          optional
          right
          background-color="primary"
          slider-color="secondary"
        >
          <!-- TODO: MOVE TO DATA OBJECT, V-for over -->
          <v-tab v-for="item in items" :key="item.value" :to="item.to">
            <BtnWithTooltip v-bind="item"></BtnWithTooltip>
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
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
          value: 'catalog'
        },
        {
          btnClass: ['mx-2'],
          to: { name: 'Calendar' },
          iconProps: { color: 'secondary', icon: 'mdi-calendar' },
          btnProps: { icon: true },
          tooltipProps: { color: 'primary', disabled: false, bottom: true },
          tooltipText: 'Reservations',
          value: 'calendar'
        }
      ]
    }
    // viewMain: {
    //   get() {
    //     return this.items.findIndex(i => i.value === this.$store.state.viewMain)
    //   },
    //   set(v) {
    //     if (typeof v === 'undefined') return
    //     this.$store.dispatch('setStateValue', {
    //       key: 'viewMain',
    //       value: this.items[v].value
    //     })
    //     localStorage.setItem('lastView', this.items[v].value)
    //   }
    // },
    // viewSub: {
    //   get() {
    //     return this.$store.state.viewSub
    //   },
    //   set(v) {
    //     this.$store.dispatch('setStateValue', {
    //       key: 'viewSub',
    //       value: v
    //     })
    //   }
    // }
  },
  methods: {
    appTitle() {
      const setting = this?.appSettings?.find(s => s.name === 'App_Name')
      return setting?.setting || 'VUESERVATIONS'
    }
  }
}
</script>
