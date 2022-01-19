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
        <v-radio-group v-model="radioResetType" class="fullWidth">
          <v-radio label="Reset demo." value="reset"> </v-radio>
          <v-card flat :disabled="radioResetType !== 'reset'" width="100%">
            <v-card-text>
              <p>
                Reset all data to demo defaults.
              </p>
              <v-sheet color="transparent" max-width="400" width="100%">
                <v-btn
                  block
                  color="warning"
                  class="font-weight-bold"
                  @click="$store.dispatch('resetDemo')"
                >
                  <v-icon color="secondary" left>mdi-reload</v-icon>

                  RESET DEMO</v-btn
                >
              </v-sheet>
            </v-card-text>
          </v-card>
          <v-divider class="my-4"></v-divider>

          <v-radio label="Delete specific data." value="select"></v-radio>

          <v-card flat :disabled="radioResetType !== 'select'" width="100%">
            <v-card-text>
              <p>Select data to delete.</p>
              <v-sheet color="transparent" max-width="400" width="100%">
                <v-checkbox
                  v-for="dataSet in dataDefaults"
                  :key="dataSet.dataName"
                  dense
                  hide-details=""
                  :label="dataSet.labelText"
                  v-model="toDelete"
                  :value="dataSet.dataName"
                  class="mt-0"
                ></v-checkbox>
              </v-sheet>
              <v-btn
                block
                color="error"
                :disabled="toDelete.length < 1"
                @click="deleteData"
                class="font-weight-bold mt-6"
              >
                <v-icon color="secondary" left>mdi-trash-can</v-icon>
                {{
                  toDelete.length > 0
                    ? `DELETE ${toDelete.length} ITEMS`
                    : 'select items'
                }}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-radio-group>
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
    dataDefaults: [
      {
        labelText: 'App settings (defaults)',
        defaultValue: null, //WILL BE PULLED IN METHOD
        dataName: 'appSettings'
      },
      {
        labelText: 'Catalog items',
        defaultValue: [],
        dataName: 'catalogItems'
      },
      {
        labelText: 'Categories',
        defaultValue: [],
        dataName: 'categories'
      },
      {
        labelText: 'Custom Fields',
        defaultValue: [],
        dataName: 'customFields'
      },
      {
        labelText: 'Events',
        defaultValue: [],
        dataName: 'events'
      },
      {
        labelText: 'Images',
        defaultValue: [],
        dataName: 'images'
      },
      {
        labelText: 'Patrons',
        defaultValue: [],
        dataName: 'patrons'
      }
    ],
    modalConfirmReset: false,
    radioResetType: 'reset',
    toDelete: []
  }),
  methods: {
    deleteData() {
      //TODO: move to component
      console.log(this.toDelete)
    }
  }
}
</script>

<style lang="scss" scoped>
.fullWidth {
  width: 100%;
}
</style>
