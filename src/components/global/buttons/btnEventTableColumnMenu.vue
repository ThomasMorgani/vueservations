<template>
  <v-menu :close-on-content-click="false" bottom offset-y>
    <template v-slot:activator="{ on }">
      <v-sheet v-on="on" color="transparent">
        <btn-with-tooltip
          :btnProps="{
            disabled: false,
            icon: true
          }"
          :iconProps="{ icon: 'mdi-table-column' }"
          :tooltipProps="{ bottom: true }"
          tooltipText="Table Columns"
        ></btn-with-tooltip>
      </v-sheet>
    </template>
    <v-card tile>
      <v-card-text class="py-0">
        <v-list dense flat tile>
          <template v-for="colGroup in Object.keys(calendarTableColumnTypes)">
            <v-subheader
              :key="calendarTableColumnTypes[colGroup].text"
              class="px-0 primary--text font-weight-bold text-subtitle-1"
            >
              <v-icon color="primary" left>{{
                calendarTableColumnTypes[colGroup].icon
              }}</v-icon>

              {{ calendarTableColumnTypes[colGroup].text }}</v-subheader
            >

            <v-list-item-group
              :key="'ig' + calendarTableColumnTypes[colGroup].text"
              v-model="calendarTableColumns[colGroup]"
              dense
              multiple
              @change="onChange"
            >
              <v-list-item
                v-for="column in calendarTableColumnTypes[colGroup].subHeaders"
                :key="column.value"
                :value="column.value"
                dense
                class="columnMenuListItem primary--text"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action class="ma-0">
                    <v-checkbox dense :input-value="active"></v-checkbox>
                  </v-list-item-action>

                  <v-list-item-content class="pl-2">
                    <v-list-item-title>{{ column.text }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import tableHeaders from '@/data/eventTableHeaders.json'

export default {
  name: 'BtnEvenTableColumnMenu',
  props: {
    selectedColumns: {
      type: Object,
      required: true
    }
  },
  computed: {
    calendarTableColumns: {
      get() {
        return this.selectedColumns
      },

      set(e) {
        console.log(e)
        this.$emit('columnSelection', e)
      }
    },
    calendarTableColumnTypes() {
      return tableHeaders.reduce((columns, header) => {
        columns[header.value] = header
        return columns
      }, {})
    }
  },
  methods: {
    onChange() {
      this.$store.dispatch('localStorageWrite', {
        key: 'calendarEventColumns',
        data: this.calendarTableColumns,
        isReference: true
      })
    }
  }
}
</script>

<style></style>
