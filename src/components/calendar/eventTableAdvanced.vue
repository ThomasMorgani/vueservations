<template>
  <v-card flat>
    <v-card-text class="pa-0">
      <Table
        :border="false"
        :cell-style="{ border: 'none' }"
        :data="tableData.items"
        empty-text="No events found."
        :header-cell-style="tableHeaderRowStyle"
        header-class-name="primary secondary--text font-weight-bold"
        :header-row-style="{ border: 'none' }"
        :height="tableData.height"
        row-class-name="primary--text font-weight-bold"
        :row-style="tableRowStyle"
        size="mini"
        unique-field="id"
        width="100%"
        class="statTable"
      >
        <TableColumn
          v-for="header in tableData.headers"
          :label="header.text"
          :prop="header.value"
          :key="header.week"
          :fixed="header.fixed"
          :width="header.width"
          :align="header.align"
          :sortable="header.sortable"
        >
          <template v-if="header.subHeaders">
            <TableColumn
              v-for="subHeader in header.subHeaders"
              :label="subHeader.text"
              :prop="subHeader.value"
              :key="subHeader.text"
              :fixed="subHeader.fixed"
              :width="subHeader.width"
              :align="subHeader.align"
              :sortable="subHeader.sortable"
              class-name="tableColStyle"
            ></TableColumn>
          </template>
        </TableColumn>
      </Table>
    </v-card-text>
  </v-card>
</template>

<script>
// import tableAdvanced from '@/components/global/tableAdvanced'
import { Table, TableColumn } from 'element-ui'
import tableHeaders from '@/data/eventTableAdvancedHeaders.json'
export default {
  name: 'eventTableAdvanced',
  props: {
    columnsDisplayed: {
      type: Object,
      required: true
    },
    events: {
      type: Array,
      required: true
    },
    height: {
      type: [String, Number],
      required: false
    }
  },
  components: {
    // tableAdvanced
    Table,
    TableColumn
  },
  computed: {
    tableColStyle() {
      return {
        padding: '0px',
        'background-color': this.theme.primary,
        color: this.theme.secondary
      }
    },
    tableRowStyle() {
      return {
        // 'background-color': this.$vuetify.theme.isDark ? this.$vuetify.theme.themes.dark.background : this.$vuetify.theme.themes.light.background,
        'background-color': this.$vuetify.theme.isDark
          ? '#1e1e1e'
          : this.$vuetify.theme.themes.light.background
      }
    },
    theme() {
      return this.$vuetify.theme.isDark
        ? this.$vuetify.theme.themes.dark
        : this.$vuetify.theme.themes.light
    },
    tableData() {
      const headers = this.formatHeaders()
      const height = this.height ? `${this.height - 30}px` : '80vh'
      const items = this.formatEvents(headers)
      return {
        headers,
        height,
        items
      }
    }
  },
  methods: {
    formatEvents(headers) {
      return this.events.map(event => {
        const tableEvent = {}
        tableEvent.id = event.id
        for (let header in headers) {
          const eventKey = headers[header].eventKey
          headers[header].subHeaders.forEach(subHeader => {
            tableEvent[subHeader.value] = event[eventKey]
              ? event[eventKey][subHeader.value]
              : event[subHeader.value]
          })
        }
        return tableEvent
      })
    },
    formatHeaders() {
      const headers = {}
      tableHeaders.forEach(header => {
        if (this.columnsDisplayed[header.value].length > 0) {
          headers[header.value] = { ...header }
          headers[
            header.value
          ].subHeaders = header.subHeaders.filter(subheader =>
            this.columnsDisplayed[header.value].includes(subheader.value)
          )
        }
      })
      return headers
    },
    // tableRowClassName({ row, rowIndex }) {
    //   // console.log(row);
    //   // console.log(rowIndex);
    //   return 'tableStyle'
    // },
    // tableHeaderStyle({ row, rowIndex }) {
    //   // console.log(row);
    //   // console.log(rowIndex);
    //   var style = {}
    //   style['padding'] = '0px'
    //   return style
    // },
    tableHeaderRowStyle({ rowIndex }) {
      if (rowIndex === 0) {
        return {
          padding: '4px',
          'background-color': this.theme.primary,
          color: this.theme.secondary
        }
      } else {
        return {
          padding: '0px',
          'background-color': this.$vuetify.theme.isDark ? '#1e1e1e' : '',

          color: this.theme.primary
        }
      }
    }
  }
}
</script>

<style></style>
