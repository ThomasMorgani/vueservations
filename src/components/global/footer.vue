<template>
  <v-footer color="primary" app dark clipped-right>
    <v-spacer></v-spacer>
    <btnWithTooltip
      :btnClass="['mx-2']"
      :btnProps="{ icon: true }"
      :iconProps="{ icon: 'mdi-help-circle-outline' }"
      :tooltipProps="{ disabled: false, top: true }"
      :tooltipText="'Help Documentation'"
      @click="viewMain = 'help'"
    ></btnWithTooltip>
    <btnWithTooltip
      :btnClass="['mx-2']"
      :btnProps="{ icon: true }"
      :iconProps="{ icon: 'mdi-account' }"
      :tooltipProps="{ disabled: false, top: true }"
      :tooltipText="'Patron Management'"
      @click="viewMain = 'patron'"
    ></btnWithTooltip>
    <btnWithTooltip
      :btnClass="['mx-2']"
      :btnProps="{ icon: true }"
      :iconProps="{ icon: 'mdi-image-multiple' }"
      :tooltipProps="{ disabled: false, top: true }"
      :tooltipText="'Image Management'"
      @click="viewMain = 'images'"
    ></btnWithTooltip>
    <btnWithTooltip
      :btnClass="['mx-2']"
      :btnProps="{ icon: true }"
      :iconProps="{ icon: 'mdi-format-columns' }"
      :tooltipProps="{ disabled: false, top: true }"
      :tooltipText="'Catalog Fields Management'"
      @click="viewMain = 'customFields'"
    ></btnWithTooltip>
    <btnWithTooltip
      :btnClass="['mx-2']"
      :btnProps="{ icon: true }"
      :iconProps="{ icon: 'mdi-cogs' }"
      :tooltipProps="{ disabled: false, top: true }"
      :tooltipText="'Settings'"
      @click="viewMain = 'settings'"
    ></btnWithTooltip>
  </v-footer>
</template>

<script>
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'

export default {
  components: {
    btnWithTooltip
  },
  computed: {
    viewMain: {
      get() {
        return this.$store.state.viewMain
      },
      set(v) {
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
