<template>
  <v-card class="primary--text">
    <v-card-title> {{ setting.name.replaceAll('_', ' ') }}</v-card-title>
    <v-card-text>
      <p>{{ setting.description }}</p>
      <slot></slot>
    </v-card-text>
    <v-card-actions>
      <btnWithTooltip
        :btnProps="{
          disabled: setting.default_value == setting.currentValue,
          icon: false,
          color: 'warning',
          tile: true
        }"
        btnText="Default"
        btnTextSide="right"
        :iconProps="{ icon: 'mdi-undo', left: true }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="`Set to default value (${setting.default_value})`"
        @click="
          $emit('updateSetting', {
            setting: setting.name,
            value: setting.default_value
          })
        "
        >Default</btnWithTooltip
      >
      <v-spacer></v-spacer>
      <btnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{
          disabled: setting.setting == setting.currentValue,
          icon: false,
          color: 'success',
          tile: true
        }"
        btnText="Save"
        btnTextSide="right"
        :iconProps="{ icon: 'mdi-content-save', left: true }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Save Setting'"
        @click="$emit('saveSetting', setting.name)"
      ></btnWithTooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'

export default {
  name: 'setting',
  components: {
    btnWithTooltip
  },
  props: {
    setting: {
      type: Object,
      required: true
    },
    currentValue: {
      required: false
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped></style>
