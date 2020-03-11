<template>
  <v-card>
    <v-card-title class="title primary--text font-weight-bold d-flex align-center pb-0">
      PATRONS
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        name="Search"
        label="Search"
        outlined
        dense
        clearable
        prepend-inner-icon="mdi-account-search"
        hide-details
        color="primary"
      ></v-text-field>

      <btnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-account-plus' }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Add Patron'"
        @click="addPatron()"
      ></btnWithTooltip>
    </v-card-title>

    <v-card-text class="pt-0">
      <tableAdvanced :tableData="tableData()" class="pa-5"></tableAdvanced>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters.js'

import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
import tableAdvanced from '@/components/global/tableAdvanced'
export default {
  name: 'patronList',
  components: {
    btnWithTooltip,
    tableAdvanced
  },
  data:() => ({
    search: null
  }),
  computed: {
    ...mapState({
      patrons: state => state.patrons
    }),
        patronsList() {
      let list = this.patrons
      if (this.search) {
        list = list.filter(i => filters.findStringMatchesInObj(i, ['first_name', 'last_name', 'barcode'], this.search))
      }
      return list
      // return this.tableData.items
    }
  },
  methods: {
     addPatron(e) {
      console.log('addPatron')
      console.log(e)
    },
    tableData() {
      console.log(this.$store.state)
      return {
        headers: [
          {
            value: 'last_name',
            text: 'LAST',
            sortable: true,
             width: this.$store.state.content.main.x /4
          },
          {
            value: 'first_name',
            text: 'FIRST',
            sortable: true,
             width: this.$store.state.content.main.x /4
          },
          {
            value: 'barcode',
            text: 'BARCODE',
            sortable: true,
             width: this.$store.state.content.main.x /4
          }
        ],
        items: this.patronsList,
        actions: ['delete', 'edit'],
        height: this.$store.state.content.main.y - 220
    }
  }
}
}
</script>

<style></style>
