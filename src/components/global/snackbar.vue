<template>
  <v-snackbar
    v-model="state"
    :key="state"
    v-bind="sbSettings"
    :color="sbData.status || sbSettings.defaultColor"
    @input="onClose"
    transition="fade-transition"
  >
    <h5 class="body-1 font-weight-bold text-uppercase">{{ sbData.status }}:</h5>
    {{ sbData.message }}
    <v-btn text color="white" @click.native="onClose">Close</v-btn>
    <v-progress-linear
      bottom
      color="white"
      :value="progress"
    ></v-progress-linear>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    progress: 100,
    progInterval: null
  }),
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
  mounted() {
    if (this.state) {
      const timeoff = Math.abs(this.sbSettings.timeout / 100)
      this.progInterval = setInterval(() => {
        this.progress -= 1
      }, timeoff)
    } else {
      if (this.progInterval) {
        clearInterval(this.progInterval)
      }
    }
  },
  beforeDestroy() {
    if (this.progInterval) {
      clearInterval(this.progInterval)
    }
  }
}
</script>

<style></style>
