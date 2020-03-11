<template>
  <!-- <v-data-table
    :headers="[
      ...tableData.headers,
      { text: '', value: 'action', sortable: false, align: 'right' }
    ]"
    :items="tableData.items"
    options.sync="paginitation"
    fixed-header
    :hide-default-footer="true"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title class="headline primary--text">{{ tableData.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="(item, key) in items" :key="key">
          <td>{{ item.first_name }}</td>
        </tr>
      </tbody>
    </template>
    <template v-slot:item.action="{ item }">
          <v-menu
            v-model="menuConfDelete"
            :close-on-content-click="false"
            top
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-icon small color="error" class="mx-2" v-on="on">
                mdi-delete
              </v-icon>
            </template>
            <v-card>
              <v-card-title class="title primary--text">
                CONFIRM DELETE
              </v-card-title>
              <v-card-actions>
                <v-btn text color="primary">CANCEL</v-btn>
                <v-spacer></v-spacer>
                <v-btn text color="error" @click="noteDelete(item)"
                  >CONFIRM</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-icon small color="warning" class="mx-2" @click="noteEdit(item)">
            mdi-pencil
          </v-icon>
    </template>
    <template v-slot:no-data>NO DATA</template>
  </v-data-table>-->
  <el-table
    :data="tableData.items"
    :height="tableData.height"
    :default-sort="{ prop: 'last_name', order: 'ascending' }"
  >
    <!-- //:width="header.width"  doesnt update on window resize -->
    <el-table-column
      v-for="(header, key) in tableData.headers"
      :key="`C${key}`"
      :prop="header.value"
      :label="header.text"
      :width="colProps.width"
      :sortable="header.sortable"
    ></el-table-column>
    <el-table-column
      v-if="tableData.actions"
      :label="'ACTIONS'"
      align="right"
      width="180"
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
      console.log('action')
      console.log(a)
      console.log(b)
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
      console.log('it works')
    }
  }
}
</script>

<style></style>
