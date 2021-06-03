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
      <v-tab v-for="item in items" :key="item.value">
        <btnWithTooltip v-bind="item"></btnWithTooltip>
      </v-tab>
    </v-tabs>
  </v-footer>
</template>

<script>
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'

export default {
  name: 'footerApp',
  components: {
    btnWithTooltip
  },
  computed: {
    items() {
      return [
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-help-circle-outline' },
          tooltipProps: { disabled: false, top: true },
          tooltipText: 'Help Documentation',
          value: 'help'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-shape' },
          tooltipProps: { disabled: false, top: true },
          tooltipText: 'Category Management',
          value: 'category'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-account' },
          tooltipProps: { disabled: false, top: true },
          tooltipText: 'Patron Management',
          value: 'patron'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-image-multiple' },
          tooltipProps: { disabled: false, top: true },
          tooltipText: 'Image Management',
          value: 'images'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-format-columns' },
          tooltipProps: { disabled: false, top: true },
          tooltipText: 'Catalog Fields Management',
          value: 'customFields'
        },
        {
          btnClass: ['mx-2'],
          btnProps: { icon: true },
          iconProps: { icon: 'mdi-cogs' },
          tooltipProps: { disabled: false, top: true },
          tooltipText: 'Settings',
          value: 'settings'
        }
      ]
    },
    viewMain: {
      get() {
        return this.items.findIndex(i => i.value === this.$store.state.viewMain)
      },
      set(v) {
        this.$store.dispatch('setStateValue', {
          key: 'viewMain',
          value: this.items[v].value
        })
        localStorage.setItem('lastView', this.items[v].value)
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
