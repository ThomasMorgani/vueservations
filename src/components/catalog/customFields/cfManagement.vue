<template>
  <v-card tile>
    <ModalTitle text="NEW FIELD"></ModalTitle>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-row align="center" justify="center" dense>
            <v-col cols="10">
              <v-text-field
                v-model="name"
                autofocus
                clearable
                label="Name"
                :messages="messagesName"
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
                  v-model="value"
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
      <v-btn text small color="warning" @click="cancel">cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="success" :disabled="isDisabled" @click="save"
        >SAVE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
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
    name: null,
    internal: true,
    type: null,
    value: null,
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
    loading: false,
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
    isDisabled() {
      return false
      // let disabled = false
      // disabled =
      //   this.messagesName.length > 0 ||
      //   this.type === null ||
      //   this.visibility === null
      // return disabled
    },
    messagesName() {
      const nameLower = String(this.name)
        .trim()
        .toLowerCase()
      const nameExists = this.customFields.findIndex(field => {
        return String(field.name).toLowerCase() === nameLower
      })
      const nameMatch = nameExists > -1 ? false : nameLower
      let messages = []

      switch (nameMatch) {
        case '':
          messages.push('Field name required.')
          break
        case 'null':
          messages.push('Field name required.')
          break
        case 'new field':
          messages.push('Select a unique name.')
          break
        case false:
          messages.push('Name already exists.')
          break
        default:
          break
      }
      return messages
    }
  },
  methods: {
    cancel() {
      this.$store.dispatch('togglemodalCatalogCustomfield')
    },
    resetFields() {
      this.alertText = null
      this.name = null
      this.internal = true
      this.type = null
      this.value = null
      this.loading = false
    },
    save() {
      const resp = {
        data: {
          name: this.name,
          internal: this.internal,
          type: this.type,
          default_value: this.value,
          id: new Date().getTime()
        },
        message: 'New custom field created',
        status: 'success'
      }

      if (resp.status === 'success') {
        if (resp.data) {
          this.$store.dispatch('customfieldsAddField', resp.data)
          this.$store.dispatch('togglemodalCatalogCustomfield')
          this.$store.dispatch('localStorageWrite', {
            key: `customFields`,
            data: this.customFields
          })
          this.$store.dispatch('toggleSnackbar', resp)
          this.$emit('customFieldCreated', resp.data)
          this.resetFields
        }
      } else {
        //not used in demo
        this.alertText = resp.message
        this.alertVisible = true
      }
    }
  },
  mounted() {
    if (this.customFieldEditing?.name) this.name = this.customFieldEditing.name
  }
}
</script>

<style></style>
