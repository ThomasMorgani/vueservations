<template>
  <tableAdvanced :tableData="tableData()"> </tableAdvanced>
</template>

<script>
import { mapState } from 'vuex'
import tableAdvanced from '@/components/global/tableAdvanced'
export default {
  name: 'patronList',
  components: {
    tableAdvanced
  },
  computed: {
    ...mapState({
      patrons: state => state.patrons
    })
  },
  methods: {
    tableData() {
      return {
        headers: [
          {
            value: 'last_name',
            text: 'LAST'
          },
          {
            value: 'first_name',
            text: 'FIRST'
          },
          {
            value: 'barcode',
            text: 'BARCODE'
          }
        ],
        items: this.patrons,
        height: 600
      }
    }
  }
}
</script>

<style></style>
