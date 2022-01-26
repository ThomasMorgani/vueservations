<template>
  <v-tooltip v-bind="{ color: 'primary', ...tooltipProps}">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-btn v-bind="btnProps" :class="btnClass" @click="$emit('click')">
          <span v-if="btnTextSide === 'left'">{{ btnText }}</span>
          <v-icon v-if="iconProps" v-bind="iconProps">
            {{ iconProps.icon }}</v-icon
          >
          <span v-if="btnTextSide === 'right'">{{ btnText }}</span>
        </v-btn>
      </div>
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
    btnTextSide: {
      type: String,
      required: false,
      default: () => 'left'
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
