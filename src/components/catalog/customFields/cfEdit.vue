<template>
  <v-card>
    <v-card-title>{{
      this.id ? 'EDIT CUSTOM FIELD' : 'NEW FIELD'
    }}</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-row align="center" justify="center" dense>
            <v-col cols="10">
              <v-text-field
                v-model="name"
                label="Name"
                :messages="messagesName"
                :error="messagesName.length > 0"
                name="Name"
                type="text"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" dense>
            <!-- <v-col cols="5">
              <v-select
                v-model="type"
                :items="fieldTypes"
                label="Type"
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>-->
            <v-col cols="10">
              <v-select
                v-model="internal"
                :items="visibilityTypes"
                label="Visibility"
                full-width
              ></v-select>
            </v-col>
            <v-col cols="10">
              <template v-if="type === 'bool'">
                <v-select
                  v-model="value"
                  :items="boolTypes"
                  label="Default Value"
                  :key="type"
                ></v-select>
              </template>
              <template v-else>
                <v-text-field
                  v-model="default_value"
                  outlined
                  label="Default Value"
                  :type="type === 'int' ? 'number' : 'text'"
                  :key="type"
                ></v-text-field>
              </template>
            </v-col>
            <v-col cols="12">
              <v-alert
                text
                outlined
                color="error"
                icon="mdi-alert"
                dense
                :value="alertVisible"
                >{{ alertText }}</v-alert
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text small color="primary" @click="cancel">cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        text
        small
        color="primary"
        :disabled="saveDisabled"
        :loading="loading"
        @click="save"
        >save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'cfEdit',
  data: () => ({
    alertText: null,
    alertVisible: false,
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
    default_value: null,
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
    id: null,
    internal: 0,
    loading: false,
    name: null,
    original_values: {
      name: null,
      internal: 0,
      default_value: null
    },
    type: 'text',
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
      customFieldEditing: state => state.customFieldEditing,
      customFields: state => state.customFields
    }),
    isChanged() {
      let isChanged = false
      Object.keys(this.original_values).forEach(k => {
        if (this[k] != this.original_values[k]) {
          isChanged = true
        }
      })
      return isChanged
    },
    saveDisabled() {
      // return this.messagesName.length > 0
      // let disabled = false
      // disabled =
      return (
        this.messagesName.length > 0 ||
        this.type === null ||
        this.visibility === null ||
        !this.isChanged
      )
      // return disabled
    },
    messagesName() {
      const nameLower = String(this.name)
        .trim()
        .toLowerCase()
      const nameExists = this.customFields.findIndex(field => {
        return (
          String(field.name).toLowerCase() === nameLower && this.id != field.id
        )
      })
      const nameMatch = nameExists > -1
      let messages = []

      switch (nameMatch) {
        case '':
          messages.push('Field name required')
          break
        case 'null':
          messages.push('Field name required')
          break
        case 'new field':
          messages.push('Select Unique Name')
          break
        case true:
          messages.push('Name already exists')
          break
        default:
          break
      }
      return messages
    }
  },
  methods: {
    cancel() {
      // this.$store.dispatch('toggleModalCatalogCustomfield')
      this.resetFields()
      this.$emit('cancel')
    },
    resetFields() {
      this.alertText = null
      this.name = null
      this.id = null
      this.internal = true
      this.type = null
      this.value = null
      this.loading = false
    },
    save() {
      this.loading = true
      let fieldData = {
        id: this.id,
        name: this.name,
        internal: this.internal,
        type: this.type,
        default_value: this.default_value
      }
      this.$store
        .dispatch('apiCall', {
          endpoint: '/customfield',
          postData: fieldData
        })
        .then(resp => {
          if (resp.status === 'success') {
            if (this.id) {
              //console.log('id, updating field')
              const cfKey = this.customFields.findIndex(
                f => f.id == fieldData.id
              )
              if (cfKey > -1) {
                this.$store.dispatch('setStateValueByKey', {
                  stateItem: 'customFields',
                  key: cfKey,
                  value: fieldData
                })
              }
            } else {
              //console.log('no id, inserting field')
              fieldData.id = resp.data
              this.$store.dispatch('setStateValue', {
                isPush: true,
                key: 'customFields',
                value: fieldData
              })
            }
            this.setValues(fieldData)
            this.$emit('actionBtn', {
              action: 'customFieldCreated',
              item: fieldData
            })
            this.loading = false
          } else {
            this.alertText = resp.message
            this.alertVisible = true
            this.loading = false
          }
        })
    },
    setValues(values) {
      Object.keys(values).forEach(k => {
        if (this[k] !== undefined) {
          this[k] = values[k]
          this.original_values[k] = values[k]
        }
      })
    }
  },
  created() {
    if (this.customFieldEditing) {
      this.setValues(this.customFieldEditing)
    }
  }
}
</script>

<style></style>
