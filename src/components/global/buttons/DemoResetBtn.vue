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
        class="d-flex flex-column align-center justify-center primary--text pt-6"
      >
        <!-- <v-card flat width="100%">
          <v-card-text class="d-flex text-center">
            <v-icon color="error" left small>mdi-alert</v-icon>
            <p class="font-weight-bold error--text">
              Any modifications made below cannot be undone and will reload the
              page after action completes.
            </p>
            <v-icon color="error" right small>mdi-alert</v-icon>
          </v-card-text>
        </v-card> -->
        <v-radio-group
          v-model="radioResetType"
          class="fullWidth d-flex flex-column align-center justify-center primary--text mt-0"
        >
          <v-radio label="Reset demo." value="reset"> </v-radio>
          <v-card
            flat
            :disabled="radioResetType !== 'reset'"
            :outlined="radioResetType === 'reset'"
            width="100%"
          >
            <v-card-text>
              <p>
                Reset all data to demo defaults.
              </p>
              <v-sheet color="transparent" max-width="400" width="100%">
                <!-- @click="$store.dispatch('resetDemo')" -->
                              <!-- TODO: MOVE TO COMPONENT, (MOVING TO SETTINGS ) -->
              <v-dialog :value="modalConfirmAction === 'reset' " max-width="700">
                <template v-slot:activator="{ on, attrs }">

                <v-btn
                 v-bind="attrs"
                    v-on="on"
                  block
                  :color="radioResetType === 'select' ? 'disabled' : 'warning'"
                  class="font-weight-bold"
                  @click="modalConfirmAction = 'reset'"
                >
                  <v-icon :color="radioResetType === 'select' ? 'disabled' : 'secondary'" left>mdi-reload</v-icon>

                  RESET DEMO</v-btn
                >
                </template>
                                <v-card>
                  <v-card-title
                    class="justify-center text-h5 primary secondary--text"
                  >
                    CONFIRM RESET
                  </v-card-title>
                  <v-card-text>
                    <v-card flat width="100%">
                      <v-card-text class="d-flex align-center justify-center">
                            <p class="text-center">
                              <span class="font-weight-bold error--text">
              Warning: 
            </span> All data will be reverted to Vueservations defaults. Please confirm to restore and reload the application. These actions cannot be undone. 
                              </p>
                      </v-card-text>
                    </v-card>
                    <v-list>
                      <v-list-item
                        three-line
                        v-for="setting in toDelete"
                        :key="setting"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="dataDefaults[setting].labelText"
                            class="font-weight-bold primary--text"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-text="dataDefaults[setting].warningText"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-btn
                      block
                      color="warning"
                      @click="$store.dispatch('resetDemo')"
                      class="font-weight-bold mt-6"
                    >
                      CONFIRM RESET
                    </v-btn>
                  </v-card-text>
                  <v-card-actions class="align-center justify-center">
                    <v-btn
                      text
                      color="warning"
                      @click="modalConfirmAction = null"
                      class="font-weight-bold mt-6"
                    >
                      CANCEL
                    </v-btn>
                 <v-spacer></v-spacer>
                 
                  </v-card-actions>
                </v-card>
              </v-dialog>
              </v-sheet>
            </v-card-text>
          </v-card>
          <v-divider class="my-8"></v-divider>

          <v-radio label="Delete specific data." value="select"></v-radio>

          <v-card
            flat
            :disabled="radioResetType !== 'select'"
            :outlined="radioResetType === 'select'"
            width="100%"
          >
            <v-card-text>
              <p>Select data to delete.</p>
              <v-sheet color="transparent" max-width="400" width="100%">
                <v-checkbox
                  v-for="dataSet in Object.keys(dataDefaults)"
                  :key="dataSet"
                  :color="radioResetType === 'select' ? 'primary' : 'disabled'"
                  dense
                  hide-details=""
                  :label="dataDefaults[dataSet].labelText"
                  v-model="toDelete"
                  :value="dataSet"
                  class="mt-0"
                ></v-checkbox>
              </v-sheet>

              <!-- TODO: MOVE TO COMPONENT, (MOVING TO SETTINGS ) -->
              <v-dialog :value="modalConfirmAction === 'select'" max-width="700">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    block
                    :color="radioResetType !== 'select' ? 'disabled' : 'error'"
                    :disabled="toDelete.length < 1"
                    @click="modalConfirmAction = 'select'"
                    class="font-weight-bold mt-6"
                  >
                    <v-icon :color="radioResetType !== 'select' ? 'disabled' : 'secondary'" left>mdi-trash-can</v-icon>
                    {{
                      toDelete.length > 0
                        ? `DELETE ${toDelete.length} ITEM${
                            toDelete.length > 1 ? 's' : ''
                          }`
                        : 'select items'
                    }}
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title
                    class="justify-center text-h5 primary secondary--text"
                  >
                    CONFIRM DELETIONS
                  </v-card-title>
                  <v-card-text>
                    <v-card flat width="100%">
                      <v-card-text class="d-flex align-center justify-center">
                        <p class="font-weight-bold primary--text">
                          Please confirm removal of the following items.
                        </p>
                      </v-card-text>
                    </v-card>
                    <v-list>
                      <v-list-item
                        three-line
                        v-for="setting in toDelete"
                        :key="setting"
                      >
                        <v-list-item-content>
                          <v-list-item-title
                            v-text="dataDefaults[setting].labelText"
                            class="font-weight-bold primary--text"
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-text="dataDefaults[setting].warningText"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-btn
                      block
                      color="error"
                      @click="deleteData"
                      class="font-weight-bold mt-6"
                    >
                      CONFIRM DELETE
                    </v-btn>
                  </v-card-text>
                  <v-card-actions class="align-center justify-center">
                    <v-btn
                      text
                      color="warning"
                      @click="modalConfirmAction = null"
                      class="font-weight-bold mt-6"
                    >
                      CANCEL
                    </v-btn>
                 <v-spacer></v-spacer>
                 
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
    dataDefaults: {
      // appSettings: {
      //   defaultValue: null, //WILL BE PULLED IN METHOD
      //   labelText: 'App settings (defaults)',
      //   warningText: 'All settings will be reverted to Vueservations defaults.'
      // },
      catalogItems: {
        defaultValue: [],
        labelText: 'Catalog items',
        warningText: 'All catalog items and  events will be removed.'
      },
      categories: {
        defaultValue: [],
        labelText: 'Categories',
        warningText:
          'All categories will be removed. Catalog items will have their category set to Vueservations default.'
      },
      customFields: {
        defaultValue: [],
        labelText: 'Custom Fields',
        warningText: 'All custom fields will be removed.'
      },
      events: {
        defaultValue: [],
        labelText: 'Events',
        warningText: 'All events will be removed.'
      },
      images: {
        defaultValue: [],
        labelText: 'Images',
        warningText:
          'All images will be removed. Catalog items will have their image set to Vueservations default.'
      },
      patrons: {
        defaultValue: [],
        labelText: 'Patrons',
        warningText: 'All patrons and associated events will be removed.'
      }
    },
    modalConfirmAction: null,
    modalConfirmReset: false,
    radioResetType: 'reset',
    toDelete: []
  }),
  methods: {
    async deleteData() {
      console.log('delete')
      await this.$store.dispatch('appDataDelete', this.toDelete)
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.fullWidth {
  width: 100%;
}
</style>
