<template>
  <v-tooltip v-bind="tooltipProps">
    <template v-slot:activator="{ on }">
      <v-btn
        v-bind="btnProps"
        v-on="on"
        :class="btnClass"
        @click="$emit('click')"
      >
        {{ btnText }}
        <v-icon v-if="iconProps"> {{ iconProps.icon }}</v-icon>
      </v-btn>
    </template>
    <span v-html="tooltipText"></span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    btnClass: {
      type: Array
    },
    btnProps: {
      type: Object,
      default: () => ({
        color: 'primary',
        text: true
      })
    },
    btnText: {
      type: String,
      required: false
    },
    iconProps: {
      type: Object,
      default: () => ({}),
      required: false
    },
    tooltipProps: {
      type: Object,
      default: () => ({
        top: true,
        disabled: true
      })
    },
    tooltipText: {
      type: String
    }
  }
}
</script>

<style></style>
