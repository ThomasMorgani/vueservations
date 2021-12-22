<template>
  <v-dialog v-model="modalConfirmReset" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-sheet
        v-bind="attrs"
        v-on="on"
        color="transparent"
        @click="modalConfirmReset = !modalConfirmReset"
      >
        <btnWithTooltip
          v-bind="{
            btnClass: ['mx-2'],
            btnProps: { icon: true },
            iconProps: { icon: 'mdi-database-sync' },
            tooltipProps: { color: 'primary', disabled: false, top: true },
            tooltipText: 'Reset demo data.',
            value: 'resetDemo'
          }"
        ></btnWithTooltip>
      </v-sheet>
      <!-- <v-btn v-bind="attrs" v-on="on" text :color="color">
        <v-icon left></v-icon>DEMO <br />RESET
      </v-btn> -->
    </template>

    <v-card>
      <v-card-title class="justify-center text-h5 primary secondary--text">
        RESET DEMO
      </v-card-title>

      <v-card-text
        class="d-flex flex-column align-center justify-center primary--text"
      >
        <p class="text-center mt-4">
          Warning! Resetting the demo will remove ALL changes and revert the
          application to it's initial state
        </p>
        <p>Are you sure you would like to continue?</p>
        <v-sheet color="transparent" max-width="400" width="100%">
          <v-btn
            block
            color="success"
            class="font-weight-bold"
            @click="$store.dispatch('resetDemo')"
            >CONFIRM</v-btn
          >
        </v-sheet>
      </v-card-text>

      <v-card-actions>
        <v-btn color="warning" text @click="modalConfirmReset = false">
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
export default {
  name: 'DemoResetButton',
  props: {
    color: {
      type: String,
      default: () => 'secondary'
    }
  },
  components: {
    btnWithTooltip
  },
  data: () => ({
    modalConfirmReset: false
  })
}
</script>

<style lang="scss" scoped></style>
