<template>
  <v-card>
    <v-card-title>NEW FIELD</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-row align="center" dense>
            <v-col cols="11">
              <v-text-field v-model="name" label="Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" dense>
            <v-col cols="5">
              <v-select v-model="type" :items="fieldTypes" label="Type"></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="5">
              <v-select v-model="internal" :items="visibilityTypes" label="Visibility"></v-select>
            </v-col>
            <v-col cols="12">
              <template v-if="type === 'bool'">
                <v-select v-model="value" :items="boolTypes" label="Default Value" :key="type"></v-select>
              </template>
              <template v-else>
                <v-text-field
                  v-model="value"
                  outlined
                  label="Default Value"
                  :type="
                    type === 'int' ? 'number' : 'text'
                  "
                  :key="type"
                ></v-text-field>
              </template>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn text small color="primary" @click="cancel">cancel</v-btn>
      <v-spacer></v-spacer>
      <v-btn text small color="primary" @click="save">save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
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
      customFields: state => state.customFields
    })
  },
  methods: {
    cancel() {
      this.$store.dispatch('modalCatalogCustomfield')
    },
    save() {
      this.$store.dispatch('callApi', {
        endpoint: '/customfield_new',
        postData: {
          name: this.name,
          internal: this.internal,
          type: this.type,
          value: this.value
        }
      })
    }
  }
}
</script>

<style>
</style>