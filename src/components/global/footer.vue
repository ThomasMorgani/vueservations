<template>
  <v-footer color="primary" app dark clipped-right class="d-flex flex-nowrap">
    <demo-tabs v-if="isDemo"></demo-tabs>
    <v-spacer></v-spacer>
    <v-tabs optional right background-color="primary" slider-color="secondary">
      <v-tab
        v-for="item in items"
        :key="item.value + $route.name"
        :to="item.to"
      >
        <BtnWithTooltip v-bind="item"></BtnWithTooltip>
      </v-tab>
    </v-tabs>
  </v-footer>
</template>

<script>
// import DemoTabs from '@/components/demo/DemoFooterTabs'

export default {
  name: 'footerApp',
  components: {
    DemoTabs: () => import('@/components/demo/DemoFooterTabs')
  },
  computed: {
    isDemo() {
      return this.$store.isDemo
    },
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
          value: 'Categories'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-card-text-outline' },
          to: { name: 'CustomFields' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Custom Fields',
          value: 'CustomFields'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-image-multiple' },
          to: { name: 'Images' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Images',
          value: 'Images'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-account' },
          to: { name: 'Patrons' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Patrons',
          value: 'Patrons'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { color: 'secondary', icon: 'mdi-cogs' },
          to: { name: 'Settings' },
          tooltipProps: { color: 'primary', disabled: false, top: true },
          tooltipText: 'Settings',
          value: 'Settings'
        }
      ]
    }
  }
}
</script>

<style></style>
