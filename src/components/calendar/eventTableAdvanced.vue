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
export default {
  name: 'eventTableAdvanced',
  props: {
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
      return {
        headers: [
          {
            text: 'ITEM',
            align: 'center',
            sortable: false,
            value: '',
            class: 'tableHeader',
            // width: '50px',
            // fixed: 'left'
            subHeaders: [
              {
                text: 'Abbr.',
                align: 'start',
                sortable: true,
                value: 'ciAbbreviation',
                class: 'tableHeader',
                width: '100px'
              },
              {
                text: 'Name',
                align: 'start',
                sortable: true,
                value: 'ciName',
                class: 'tableHeader'
                // width: '50px',
              }
            ]
          },
          {
            text: 'PATRON',
            align: 'center',
            sortable: false,
            value: '',
            class: 'tableHeader',
            // width: '50px',
            // fixed: 'left'
            subHeaders: [
              {
                text: 'Last',
                align: 'start',
                sortable: true,
                value: 'patronLastName',
                class: 'tableHeader'
                // width: '50px',
              },
              {
                text: 'First',
                align: 'start',
                sortable: true,
                value: 'patronFirstName',
                class: 'tableHeader'
                // width: '50px',
              }
            ]
          },
          {
            text: 'SCHEDULE',
            align: 'center',
            sortable: false,
            value: '',
            class: 'tableHeader',
            // width: '50px',
            // fixed: 'left'
            subHeaders: [
              {
                text: 'Start',
                align: 'start',
                sortable: true,
                value: 'startDate',
                class: 'tableHeader'
                // width: '50px',
              },
              {
                text: 'End',
                align: 'start',
                sortable: true,
                value: 'endDate',
                class: 'tableHeader'
                // width: '50px',
              }
            ]
          }
        ],
        items: this.formatEvents(this.events),
        height: this.height ? `${this.height - 30}px` : '80vh'
      }
    }
  },
  methods: {
    formatEvents(events) {
      //todo: setup dropdown to select table columns,
      //map seletions to eventData,
      //iterate over selected
      return events.map(e => {
        return {
          id: e.id ?? new Date().getTime(),
          ciAbbreviation: e.ciData?.abbreviation ?? '',
          ciName: e.ciData?.name ?? '',
          endDate: e.endDate ?? '',
          startDate: e.startDate ?? '',
          patronFirstName: e.patronData?.first_name ?? '',
          patronLastName: e.patronData?.last_name ?? ''
        }
      })
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
          padding: '0px',
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
