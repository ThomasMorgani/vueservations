<template>
  <v-card>
    <v-card-title
      class="title primary--text font-weight-bold d-flex align-center pb-0"
    >
      CUSTOM FIELDS
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        name="Search"
        label="Search"
        outlined
        dense
        clearable
        prepend-inner-icon="mdi-feature-search-outline"
        hide-details
        color="primary"
      ></v-text-field>

      <btnWithTooltip
        :btnClass="['mx-4']"
        :btnProps="{ icon: true, color: 'primary' }"
        :iconProps="{ icon: 'mdi-card-plus-outline' }"
        :tooltipProps="{ disabled: false, top: true }"
        :tooltipText="'Add New Field'"
        @click="fieldAdd()"
      ></btnWithTooltip>
    </v-card-title>

    <v-card-text class="pt-0">
      <tableAdvanced
        :tableData="tableData"
        @actionBtn="onAction"
      ></tableAdvanced>
    </v-card-text>
    <v-dialog
      v-model="modalAction"
      scrollable
      persistent=""
      max-width="700px"
      transition="dialog-transition"
    >
      <component
        :is="modalComp"
        :key="modalAction"
        v-bind="modalCompData"
        @actionBtn="onAction"
        @cancel="modalClose"
        @close="modalClose"
      ></component>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/modules/filters.js'
import * as formats from '@/modules/formats.js'
import Vue2Filters from 'vue2-filters'

import btnWithTooltip from '@/components/global/buttons/btnWithTooltip'
import tableAdvanced from '@/components/global/tableAdvanced'
export default {
  name: 'cfList',
  components: {
    btnWithTooltip,
    cfEdit: () => import('@/components/catalog/customFields/cfEdit'),
    cfDelete: () => import('@/components/catalog/customFields/cfDelete'),
    tableAdvanced
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    modalAction: false,
    modalComp: null,
    modalCompData: null,
    search: null
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      customFields: state => state.customFields
    }),
    fieldsList() {
      let list = this.customFields
      if (this.search) {
        list = list.filter(i =>
          filters.findStringMatchesInObj(
            i,
            ['name', 'default_value'],
            this.search
          )
        )
      }
      return list.map(i => {
        return {
          id: i.id || null,
          default_value: i.default_value || '-',
          internal: i.internal == 1 ? 'Internal' : 'Public',
          name: i.name
        }
      })
      // return this.tableData.items
    },
    tableData() {
      return {
        headers: [
          {
            value: 'name',
            text: 'FIELD NAME',
            sortable: true,
            width: this.$store.state.content.main.x / 4
          },
          {
            value: 'default_value',
            text: 'DEFAULT',
            sortable: true,
            width: this.$store.state.content.main.x / 4
          },
          {
            value: 'internal',
            text: 'VISIBILITY',
            sortable: true,
            width: this.$store.state.content.main.x / 4
          }
        ],
        items: this.orderBy(this.fieldsList, 'name'),
        // actions: ['delete', 'edit', 'details'],
        actions: ['delete', 'edit'],
        height: this.$store.state.content.main.y - 200
      }
    }
  },
  methods: {
    // detailsShow(field) {
    //   console.log('details show')
    //   console.log(field)
    //   console.log(
    //     this.orderBy(
    //       formats.cfCiValuesSimple(field.id, this.catalogItems),
    //       'ci_name'
    //     )
    //   )
    //   this.modalCompData = {
    //     field: field,
    //     tableData: {
    //       headers: [
    //         {
    //           value: 'catalog_item',
    //           text: 'CATALOG ITEM'
    //         },
    //         {
    //           value: 'field_value',
    //           text: 'VALUE'
    //         }
    //       ],
    //       items: this.orderBy(
    //         formats.cfCiValuesSimple(
    //          field.id,
    //           this.catalogItems
    //         ),
    //         'catalog_item'
    //       ),
    //       height: 400
    //     }
    //   }
    //   this.modalComp = 'patronHistory'
    //   this.modalAction = true
    // },
    modalClose() {
      this.modalAction = false
    },
    // onAction({ action, rowIndex, item }) {
    onAction({ action, item }) {
      // //console.log(item)
      const field = this.customFields.find(f => f.id == item.id)
      switch (action) {
        case 'add':
          this.fieldAdd()
          break
        case 'customFieldCreated':
          this.modalClose()
          this.fieldUpdateCatalogItems(item)
          break
        case 'delete':
          this.fieldDeletePrompt(field)
          break
        case 'deleteConfirm':
          this.fieldDelete(field)
          break
        case 'edit':
          this.fieldEdit(field)
          break
        case 'details':
          this.detailsShow(field)
          break
        default:
        //console.log('default reached')
        //console.log(action)
        //console.log(item)
      }
    },
    fieldAdd() {
      this.$store.dispatch('setStateValue', {
        key: 'customFieldEditing',
        value: null
      })
      this.modalComp = 'cfEdit'
      this.modalAction = true
    },
    fieldDelete(field) {
      //dispatch api
      this.$store
        .dispatch('apiCall', {
          endpoint: '/customfield/' + field.id
        })
        .then(resp => {
          if (resp.status === 'success') {
            const fKey = this.customFields.findIndex(f => f.id == field.id)
            if (fKey > -1) {
              this.$store.dispatch('deleteStateValueByKey', {
                stateItem: 'customFields',
                key: fKey
              })
            }
            this.fieldDeleteFromCatalogItems(field)
            this.$store.dispatch('setStateValue', {
              key: 'patronEditing',
              value: null
            })
            this.modalAction = false
          }
        })
        .catch(err => console.log(err))
    },
    fieldDeleteFromCatalogItems(field) {
      this.catalogItems.forEach((ci, ciIndex) => {
        if (ci.custom_fields?.length > 0) {
          const fieldIndex = ci.custom_fields.findIndex(
            f => f.field_id == field.id
          )
          if (fieldIndex > -1) {
            this.$delete(this.catalogItems[ciIndex].custom_fields, fieldIndex)
          }
        }
      })
    },
    fieldUpdateCatalogItems(field) {
      //console.log(field)
      this.catalogItems.forEach((ci, ciIndex) => {
        if (ci.custom_fields?.length > 0) {
          const fieldIndex = ci.custom_fields.findIndex(
            f => f.field_id == field.id
          )
          //console.log(fieldIndex)
          if (fieldIndex > -1) {
            this.$set(this.catalogItems[ciIndex].custom_fields, fieldIndex, {
              ...this.catalogItems[ciIndex].custom_fields[fieldIndex],
              internal: field.internal,
              type: field.type,
              name: field.name
            })
          }
        }
      })
    },
    fieldDeletePrompt(field) {
      this.modalCompData = {
        field: field,
        affectedItems: {
          headers: [
            {
              value: 'ci_name',
              text: 'CATALOG ITEM',
              width: 200
            },
            {
              value: 'field_value',
              text: 'VALUE',
              width: 200
            }
          ],
          items: this.orderBy(
            formats.cfCiValuesSimple(field.id, this.catalogItems),
            'ci_name'
          ),
          height: 200
        }
      }
      this.modalComp = 'cfDelete'
      this.modalAction = true
    },
    fieldEdit(field) {
      this.$store.dispatch('setStateValue', {
        key: 'customFieldEditing',
        value: field
      })
      this.modalComp = 'cfEdit'
      this.modalAction = true
    }
  }
}
</script>

<style></style>
