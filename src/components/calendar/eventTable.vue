<template>
  <v-card flat tile>
    <v-card-text class="text-center pa-0">
      <v-card v-if="!hasColumns || !hasEvents" tile outlined height="120">
        <v-card-text class="primary--text ">
          <p>
            {{ !hasColumns ? 'No columns selected.' : 'No events found.' }}
          </p>
          <p v-if="!hasColumns">
            Use the
            <v-icon color="primary">mdi-table-column</v-icon> menu above to
            enable table columns.
          </p>
        </v-card-text>
      </v-card>
      <Table
        v-if="hasColumns && hasEvents"
        :border="false"
        :cell-style="cellClass"
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
          <TableColumn v-if="header.value === 'item'" align="center" width="45">
            <template slot-scope="scope">
              <v-btn color="primary" icon small @click="onEdit(scope)"
                ><v-icon small>mdi-calendar-search</v-icon></v-btn
              >
            </template>
          </TableColumn>
          <template v-if="header.subHeaders">
            <TableColumn
              v-for="subHeader in header.subHeaders"
              :label="subHeader.text"
              :prop="subHeader.value"
              :key="subHeader.text"
              :fixed="subHeader.fixed"
              :min-width="subHeader['min-width']"
              :width="subHeader.width"
              :align="subHeader.align"
              :sortable="subHeader.sortable"
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
import tableHeaders from '@/data/eventTableHeaders.json'
export default {
  name: 'eventTable',
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
    hasColumns() {
      return (
        Object.values(this.columnsDisplayed).filter(col => col.length > 0)
          .length > 0
      )
    },
    hasEvents() {
      return this.events.length > 0
    },
    tableColStyle() {
      return {
        padding: '0px',
        'background-color': this.theme.secondary,
        color: this.theme.primary
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
    cellClass(obj) {
      return {
        border: 'none',
        'box-sizing': 'border-box',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'normal',
        'word-break': 'break-all',
        'line-height': '23px',
        'padding-right': '10px'
      }
      return obj.columnIndex === 0 ? 'tableCell' : 'tableCell'
    },
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
    onEdit({ row }) {
      const event = this.events.find(e => e.id == row.id)
      this.$emit('showDetails', {
        type: 'event',
        event: { eventData: event }
      })
    },
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

<style>
.tableCell {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-right: 10px;
}
</style>
