<template>
  <v-snackbar
    v-model="state"
    v-bind="sbSettings"
    :color="sbData.status || sbSettings.defaultColor"
    @input="onClose"
  >
    <h5 class="body-1 font-weight-bold text-uppercase">{{ sbData.status }}:</h5>
    {{ sbData.message }}
    <v-btn text color="white" @click.native="onClose">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      sbData: 'snackbarData',
      sbSettings: 'snackbarSettings',
      sbState: 'snackbarState'
    }),
    state: {
      get() {
        return this.sbState
      },
      set(val) {
        this.$store.dispatch('setStateValue', {
          key: 'snackbarState',
          value: val
        })
      }
    }
  },
  methods: {
    onClose() {
      this.state = false
      this.$store.dispatch('setStateValue', { key: 'snackbarData', value: {} })
    }
  },
  watch: {
    state() {
      console.log(this.sbSettings)
      console.log(this.sbData)
    }
  }
}
</script>

<style></style>
