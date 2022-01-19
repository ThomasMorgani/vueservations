<template>
  <v-footer color="primary" app dark clipped-right>
    <v-spacer></v-spacer>
    <v-tabs
      v-model="viewMain"
      optional
      right
      background-color="primary"
      slider-color="secondary"
    >
      <!-- TODO: MOVE TO DATA OBJECT, V-for over -->
      <v-tab href="#demoReset" key="demoReset" value="demoReset">
        <DemoResetBtn></DemoResetBtn>
      </v-tab>
      <v-tab
        v-for="item in items"
        :href="'#' + item.value"
        :key="item.value"
        :value="item.value"
      >
        <btnWithTooltip v-bind="item"></btnWithTooltip>
      </v-tab>
    </v-tabs>
  </v-footer>
</template>

<script>
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
import DemoResetBtn from '@/components/global/buttons/DemoResetBtn'

export default {
  name: 'footerApp',
  components: {
    btnWithTooltip,
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
          iconProps: { icon: 'mdi-shape' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Category Management',
          value: 'category'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-card-text-outline' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Custom Fields Management',
          value: 'customFields'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-image-multiple' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Image Management',
          value: 'images'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-account' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Patron Management',
          value: 'patron'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-cogs' },
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
