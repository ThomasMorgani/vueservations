<template>
  <v-footer color="primary" app dark clipped-right>
    <v-tabs
      v-model="viewMain"
      optional
      right
      background-color="primary"
      slider-color="secondary"
    >
      <!-- TODO: MOVE TO DATA OBJECT, V-for over -->
      <v-tab key="demoReset" value="demoReset">
        <DemoResetBtn></DemoResetBtn>
      </v-tab>
      <v-spacer></v-spacer>
      <v-tab
        v-for="item in items"
        :href="'#' + item.value"
        :key="item.value"
        :to="item.to"
        :value="item.value"
      >
        <BtnWithTooltip v-bind="item"></BtnWithTooltip>
      </v-tab>
    </v-tabs>
  </v-footer>
</template>

<script>
import DemoResetBtn from '@/components/global/buttons/DemoResetBtn'

export default {
  name: 'footerApp',
  components: {
    DemoResetBtn
  },
  computed: {
    items() {
      return [
        // {
        //   btnClass: ['mx-2'],
        //   btnProps: { icon: true },
        //   iconProps: { icon: 'mdi-help-circle-outline' },
        //   tooltipProps: { color: 'primary', disabled: false, top: true },
        //   tooltipText: 'Help Documentation',
        //   value: 'help'
        // },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-shape' },
          to: { name: 'Categories' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Categories',
          value: 'category'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-card-text-outline' },
          to: { name: 'CustomFields' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Custom Fields',
          value: 'customFields'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-image-multiple' },
          to: { name: 'Images' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Images',
          value: 'images'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-account' },
          to: { name: 'Patrons' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Patrons',
          value: 'patron'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-cogs' },
          to: { name: 'Settings' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Settings',
          value: 'settings'
        }
      ]
    },
    viewMain: {
      get() {
        return this.$store.state.viewMain
      },
      set(v) {
        if (typeof v === 'undefined' || v === 'demoReset') return
        this.$store.dispatch('setStateValue', {
          key: 'viewMain',
          value: v
        })
        localStorage.setItem('lastView', v)
      }
    },
    viewSub: {
      get() {
        return this.$store.state.viewSub
      },
      set(v) {
        this.$store.dispatch('setStateValue', {
          key: 'viewSub',
          value: v
        })
      }
    }
  }
}
</script>

<style></style>
