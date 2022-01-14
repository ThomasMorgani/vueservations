<template>
  <el-table
    :data="tableData.items"
    :height="tableData.height"
    :default-sort="{ prop: 'last_name', order: 'ascending' }"
    empty-text="No results found"
  >
    <!-- //:width="header.width"  doesnt update on window resize -->
    <el-table-column
      v-for="(header, key) in tableData.headers"
      :key="`C${key}`"
      :prop="header.value"
      :label="header.text"
      :width="colProps.width"
      :sortable="header.sortable"
      class="elTd"
      ref="table"
    ></el-table-column>
    <el-table-column
      v-if="tableData.actions"
      :label="'ACTIONS'"
      align="right"
      fixed="right"
      :width="tableData.actions.length * 50"
    >
      <template slot-scope="scope">
        <v-btn
          v-for="(action, key) in tableData.actions"
          :key="`A${key}`"
          icon
          :color="actionsData[action].color"
          @click="
            $emit('actionBtn', {
              action: action,
              rowIndex: scope.$index,
              item: scope.row
            })
          "
        >
          <v-icon :color="actionsData[action].color">{{
            actionsData[action].icon
          }}</v-icon>
        </v-btn>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="first_name" label="Name" width="180"></el-table-column>
    <el-table-column prop="barcode" label="Address"></el-table-column>-->
  </el-table>
</template>

<script>
export default {
  name: 'tableAdvanced',
  props: {
    tableData: {
      type: Object,
      required: true
    },
    catalogItem: {
      type: Object,
      required: false
    }
  },
  data: () => ({
    actionsData: {
      delete: {
        color: 'error',
        icon: 'mdi-delete',
        action: 'delete'
      },
      details: {
        color: 'primary',
        icon: 'mdi-information-outline',
        action: 'details'
      },
      edit: {
        color: 'warning',
        icon: 'mdi-pencil',
        action: 'edit'
      },
      history: {
        color: 'primary',
        icon: 'mdi-history',
        action: 'history'
      }
    }
  }),
  computed: {
    colProps() {
      const contentWidth = this.$store.state.content.main.x
      const numColumns =
        this.tableData.actions.length > 0
          ? this.tableData.headers.length + 1
          : this.tableData.headers.length
      return {
        width: contentWidth / numColumns
      }
    }
  },
  methods: {
    actionBtn(a, b) {
      //console.log('action')
      //console.log(a)
      //console.log(b)
      return { a, b }
    }
  },
  created() {
    const test = {
      isOk: false,
      setting: {
        isOn: true
      }
    }
    if (test?.setting?.isOn) {
      //console.log('it works')
    }
  },
  mounted() {
    // //console.log(this.$refs.table)
  }
}
</script>

<style scoped>
>>> .cell {
  word-break: break-word;
}
</style>
