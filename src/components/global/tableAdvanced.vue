<template>
  <v-data-table
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
        <v-toolbar-title class="headline primary--text">
          {{ tableData.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>
    <template v-slot:body="{ items }">
      <v-responsive
        :style="{ height: tableData.height + 'px', 'overflow-y': 'scroll' }"
      >
        <tbody>
          <tr v-for="(item, key) in items" :key="key">
            <td>{{ item.first_name }}</td>
          </tr>
        </tbody>
      </v-responsive>
    </template>
    <!-- <template v-slot:item.action="{ item }">
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
        </template> -->
    <template v-slot:no-data>
      NO DATA
    </template>
  </v-data-table>
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
    options: {
      itemsPerPage: -1,
      sortBy: 'date_created'
    }
  }),
  methods: {}
}
</script>

<style></style>
