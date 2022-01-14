<template>
  <v-card>
    <v-dialog
      v-model="modalCatalogCustomfield"
      persistent
      max-width="500px"
      transition="dialog-transition"
      :key="`cinewfEdit${String(fieldAddingNew ? fieldAddingNew : 'none')}`"
    >
      <catalogCustomfield
        @customFieldCreated="updateField(cfEditingIdx, $event)"
        class="catalogCustomfield"
      ></catalogCustomfield>
    </v-dialog>
    <v-card-title class="justify-center title primary--text outlined">
      <ModalTitleText
        :text="catalogItemediting.id ? `EDIT DETAILS` : 'ADD FIELDS'"
      ></ModalTitleText>
      {{
    }}</v-card-title>
    <v-card-text class="modalBody">
      <template v-if="fieldsDisplayed.length < 1">
        <p class="mt-6 text-center">
          No custom fields set for this catalog item.
        </p>
        <p class="text-center">Use the "ADD" button below to add new fields.</p>
      </template>
      <template v-for="(field, index) in fieldsDisplayed">
        <v-card
          elevation="3"
          outlined
          :key="field.objectKey + 'row'"
          class="pa-3 mb-1"
        >
          <v-row dense align="center">
            <v-col cols="8" class="pt-0">
              <p class="title font-weight-bold primary--text mb-0">
                {{
                  (fields[field.objectKey] && fields[field.objectKey].name) ||
                    'New Field'
                }}
              </p>
            </v-col>
            <v-col cols="4" class="text-right pt-0">
              <v-btn
                small
                icon
                color="error"
                :disabled="!isEditing(field.objectKey)"
                @click="deleteField(field.objectKey)"
                class="mr-2"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
              <v-btn
                small
                icon
                color="warning"
                @click="editField(field.objectKey)"
              >
                <v-icon>
                  {{
                    isEditing(field.objectKey) ? 'mdi-pencil-off' : 'mdi-pencil'
                  }}
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row dense v-if="!isEditing(field.objectKey)">
            <v-col cols="12">
              <v-row align="center" dense>
                <v-col
                  class="subheading primary--text font-weight-bold d-flex shrink py-0"
                  >Value:</v-col
                >
                <v-col>{{
                  fields[field.objectKey] && fields[field.objectKey].value
                }}</v-col>
              </v-row>
              <!-- <v-row align="center" dense>
                <v-col
                  class="subheading primary--text font-weight-bold d-flex shrink py-0"
                  >Type:
                </v-col>
                <v-col>{{ fields[field.objectKey].type }}</v-col>
              </v-row>-->
              <v-row align="center" dense>
                <v-col
                  class="subheading primary--text font-weight-bold d-flex shrink py-0"
                  >Visibility:</v-col
                >
                <v-col>
                  {{
                    fields[field.objectKey] &&
                    fields[field.objectKey].internal === '1'
                      ? 'Internal'
                      : 'Public'
                  }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <!-- IS editing-->
          <v-row dense align="center" v-else>
            <v-col cols="11">
              <v-autocomplete
                v-model="fields[field.objectKey]"
                :hide-no-data="modalCatalogCustomfield"
                :items="
                  orderBy(
                    [...customFieldsAvailable, fields[field.objectKey]],
                    'name'
                  )
                "
                item-text="name"
                item-value="name"
                :error="!fields[field.objectKey].name"
                name="Name"
                autocomplete="off"
                label="Name"
                return-object
                @change="updateField(field.objectKey, $event)"
                @update:search-input="cfEditingSearchInput = $event"
              >
                <template #no-data>
                  <v-card>
                    <v-card-text class="d-flex flex-column align-center">
                      <p class="">
                        No Fields found.
                      </p>
                      <v-btn
                        color="primary"
                        text
                        @click="
                          createNewCustomField(index, {
                            ...fields[field.objectKey]
                          })
                        "
                      >
                        <v-icon color="primary" left>mdi-plus</v-icon> ADD
                        FIELD</v-btn
                      >
                    </v-card-text>
                  </v-card>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="1">
              <v-btn
                large
                text
                icon
                color="primary"
                @click="
                  createNewCustomField(index, {
                    ...fields[field.objectKey]
                  })
                "
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>
            <!-- <v-col cols="5">
              <v-select
                v-model="fields[field.objectKey].type"
                :items="fieldTypes"
                label="Type"
              >
              </v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-select
                v-model="fields[field.objectKey].internal"
                :items="visibilityTypes"
                label="Visibility"
              >
              </v-select>
            </v-col>-->
            <v-col cols="12">
              <v-row align="center" dense>
                <v-col
                  class="subheading primary--text font-weight-bold d-flex shrink py-0"
                  >Visibility:</v-col
                >
                <v-col>
                  {{
                    fields[field.objectKey].internal === '1'
                      ? 'Internal'
                      : 'Public'
                  }}
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12">
              <template v-if="fields[field.objectKey].type === 'bool'">
                <v-select
                  :key="fields[field.objectKey].type"
                  :error="!fields[field.objectKey].value"
                  v-model="fields[field.objectKey].value"
                  :items="boolTypes"
                  label="Value"
                ></v-select>
              </template>
              <template v-else>
                <v-text-field
                  v-model="fields[field.objectKey].value"
                  outlined
                  label="Value"
                  :type="
                    fields[field.objectKey].type === 'int' ? 'number' : 'text'
                  "
                  :key="fields[field.objectKey].type"
                  :error="!fields[field.objectKey].value"
                ></v-text-field>
              </template>
            </v-col>
          </v-row>
        </v-card>
      </template>
    </v-card-text>
    <v-card-actions>
      <v-tooltip color="primary" top>
        <template v-slot:activator="{ on }">
          <v-btn text color="success" large v-on="on" @click="addField">
            <v-icon color="success" small>mdi-plus</v-icon>

            ADD</v-btn
          >
        </template>
        <span>Add new custom field</span>
      </v-tooltip>
      <v-tooltip color="primary" top>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              color="warning"
              text
              :disabled="!isChanged"
              @click="restoreValues"
              >RESET</v-btn
            >
          </div>
        </template>
        <span>Revert all unsaved changes</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="cancel">CANCEL</v-btn>
      <v-tooltip color="primary" top :disabled="!saveDisabled && !isChanged">
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              text
              color="primary"
              :disabled="saveDisabled"
              :loading="loading === 'save'"
              @click="saveFields"
            >
              <v-icon
                color="warning"
                class="mr-1"
                v-if="isChanged && !saveDisabled"
                >mdi-content-save-alert</v-icon
              >SAVE
            </v-btn>
          </div>
        </template>
        <span>{{ saveTooltipText }}</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import Vue2Filters from 'vue2-filters'
import filters from '@/modules/filters'

export default {
  name: 'catalogItemEditFields',
  components: {
    catalogCustomfield: () =>
      import('@/components/catalog/customFields/cfManagement')
  },
  mixins: [Vue2Filters.mixin],
  data: () => ({
    autocomplete: {},
    boolTypes: [
      {
        value: '0',
        text: 'False'
      },
      {
        value: '1',
        text: 'True'
      }
    ],
    cfEditingSearchInput: null,
    cfEditingIdx: null,
    fieldAddingNew: null,
    fields: {},
    fieldsediting: [],
    fieldsOriginal: {},
    loading: null,
    fieldTemplate: {
      internal: null,
      name: null,
      type: null,
      value: null
    },
    fieldTypes: [
      {
        value: 'int',
        text: 'Number'
      },
      {
        value: 'text',
        text: 'Text'
      },
      {
        value: 'bool',
        text: 'True/False'
      }
    ],
    visibilityTypes: [
      {
        value: '0',
        text: 'Public'
      },
      {
        value: '1',
        text: 'Internal'
      }
    ]
  }),
  computed: {
    ...mapState({
      catalogItems: state => state.catalogItems,
      catalogItemediting: state => state.catalogitemediting,
      catalogitemFieldsediting: state => state.catalogitemFieldsediting,
      customFields: state => state.customFields,
      modalCatalogCustomfield: state => state.modalCatalogCustomfield
    }),
    customFieldsAvailable() {
      let fields = []
      let arrKey
      this.customFields.forEach(customField => {
        arrKey = this.fieldsDisplayed.findIndex(
          el => customField.id === el.field_id
        )

        if (arrKey < 0) {
          fields.push(customField)
        }
      })
      return fields
    },
    customFieldsErrors() {
      return null
    },
    fieldsDisplayed() {
      let fields = []
      Object.keys(this.fields).forEach(key =>
        fields.push({ ...this.fields[key], objectKey: key })
      )
      return fields
    },
    fieldsRequired() {
      let required = []
      this.fieldsDisplayed.forEach(el => {
        if (!el.name || !el.value) {
          required.push(el)
        }
      })
      return required
    },
    isChanged() {
      let changed = false
      changed =
        Object.keys(this.fields).length !==
        Object.keys(this.fieldsOriginal).length
      //console.log(changed)
      Object.keys(this.fields).forEach(key => {
        if (this.fieldsOriginal?.[key]) {
          if (
            this.fields[key].name !== this.fieldsOriginal[key].name ||
            this.fields[key].value !== this.fieldsOriginal[key].value
          ) {
            changed = true
          }
        } else {
          changed = true
        }
      })
      return changed
    },
    saveDisabled() {
      return !this.isChanged || this.fieldsRequired.length > 0
    },
    saveTooltipText() {
      let text = 'Errors with form'
      if (!this.isChanged) {
        text = 'There are no unsaved changes'
      } else if (this.fieldsRequired.length > 0) {
        text = 'Required fields missing'
        // text = 'The following fields are required:'
        // for (let i in this.fieldsRequired) {
        //   text =
        //     i == this.fieldsRequired.length - 1
        //       ? `${text} ${this.fieldsRequired[i]}`
        //       : `${text} ${this.fieldsRequired[i]},`
        // }
      } else if (this.isChanged) {
        text = 'Save pending changes'
      }
      return text
    }
  },
  methods: {
    cancel() {
      this.$store.dispatch('toggleModalCatalogitemEditCustomfields')
      this.reset()
    },
    addField() {
      //set unique key to track field
      const newKey =
        Object.keys(this.fields).length < 1
          ? 0
          : parseInt(
              this.fieldsDisplayed[Object.keys(this.fields).length - 1]
                .objectKey
            ) + 1
      //add new field which will always be one more than last
      this.$set(this.fields, newKey, { ...this.fieldTemplate })
      //set new field to edit mode
      this.editField(newKey)
      //console.log(this.fields)
    },
    createNewCustomField(index) {
      this.$store.dispatch('toggleModalCatalogCustomfield', {
        name: this.cfEditingSearchInput
      })
      this.cfEditingIdx = index
    },
    customFieldById(id) {
      return filters.customfieldById(id, this.customFields)
    },
    deleteField(key) {
      //key = String(key);
      this.$delete(this.fields, key)
      this.fieldsediting.splice(this.fieldsediting.indexOf(key), 1)
    },
    editField(key) {
      key = String(key)
      //check if field is in array, get key
      const fieldKey = this.fieldsediting.indexOf(key)
      //if editing, remove to disable, else add to editing
      fieldKey < 0
        ? this.fieldsediting.push(key)
        : this.fieldsediting.splice(fieldKey, 1)
    },
    isEditing(key) {
      //determine if "edit mode" is enabled for field from field.objectKey
      key = String(key)
      const fieldKey = this.fieldsediting.indexOf(key)
      return fieldKey > -1
    },
    formatFields() {
      //FORMATE BEFORE SAVING
      let fields = []
      Object.values(this.fields).forEach(field => {
        fields.push({
          field_id: field.field_id,
          internal: field.internal,
          name: field.name,
          type: field.type,
          value: field.value
        })
      })
      return fields
    },
    updateField(fieldKey, fields = null) {
      this.cfEditingSearchInput = null
      if (fieldKey && fields == null) {
        this.$set(this.fields, fieldKey, { ...this.fieldTemplate })
        return
      }
      //SWITCH?
      for (let key in fields) {
        if (key !== 'id' && key !== 'default_value') {
          //SET VALUE TO DEFAULT VALUE ?
          // if (this.fields[fieldKey][key] !== undefined)
          this.$set(this.fields[fieldKey], key, fields[key])
        } else {
          if (key === 'id') {
            this.$set(this.fields[fieldKey], 'field_id', fields[key])
          }
          if (key === 'default_value') {
            this.$set(this.fields[fieldKey], 'value', fields[key])
          }
        }
      }
    },
    reset() {
      this.$store.dispatch('catalogitemeditingcustomfieldsSetediting', [])
      this.fieldsediting = []
      this.loading = null
    },
    restoreValues() {
      this.fields = { ...this.fieldsOriginal }
      this.fieldsediting = []
    },
    saveFields() {
      // if (Object.keys(this.fields).length < 1) {
      //console.log('no fields. if fields !== fields_original:')
      //console.log('confirm removing all fields, set new endpoint?')
      // }
      if (!this.catalogItemediting.id) {
        this.$store.dispatch('catalogitemeditingSetValue', {
          key: 'customFields',
          data: this.formatFields()
        })
        this.$store.dispatch('toggleModalCatalogitemEditCustomfields')
        this.reset()
        return
      }
      const resp = {
        data: this.formatFields(),
        message: 'Details saved.',
        status: 'success'
      }

      this.$store.dispatch('catalogitemeditingSetValue', {
        key: 'customFields',
        data: resp.data
      })
      this.$store.dispatch('catalogitemSetValue', {
        id: this.catalogItemediting.id,
        key: 'custom_fields',
        data: resp.data
      })
      this.$store.dispatch('toggleModalCatalogitemEditCustomfields')
      this.reset()

      this.$store.dispatch('localStorageWrite', {
        key: `catalogItems`,
        data: this.catalogItems
      })
      this.$store.dispatch('toggleSnackbar', resp)
    }
  },
  created() {
    //console.log('edit fields modal created___')
    //Form available for creating new fields in app or an exisiting catalog item
    //if editing an existing item check custom fields are present and set each to
    //fields object to initialize reactivity
    //TODO: FIX BELOW, SET FUNCTION TO FORMAT DATA STRUCTURES PROPERLY
    //WAY TOO HACKY??
    if (
      this.catalogitemFieldsediting &&
      this.catalogItemediting.customFields &&
      this.catalogItemediting.customFields.length > 0
    ) {
      for (let key in this.catalogitemFieldsediting) {
        this.$set(this.fields, key, {
          ...this.catalogitemFieldsediting[key]
        })
        this.$set(this.fieldsOriginal, key, {
          ...this.catalogitemFieldsediting[key]
        })
        this.$set(this.autocomplete, key, {
          ...this.catalogitemFieldsediting[key]
        })
        this.$delete(this.autocomplete[key], 'field_id')
      }
    }
  }
}
</script>

<style scoped>
.modalBody {
  height: 70vh;
  overflow-y: auto;
}
.catalogCustomfield {
  z-index: 209;
}
</style>
