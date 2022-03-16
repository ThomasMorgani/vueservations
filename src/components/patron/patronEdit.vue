<template>
  <v-card tile>
    <modal-title
      :text="`${patronEditing && patronEditing.id ? 'EDIT' : 'ADD'} PATRON`"
    ></modal-title>
    <v-card-text
      style="max-height: 600px;"
      :class="{ 'pa-8': $vuetify.breakpoint.smAndUp }"
    >
      <v-form ref="form">
        <v-row align="center" justify="space-around">
          <v-col cols="12" sm="10" md="5" class="text-center pa-1"
            ><v-text-field
              v-model="first_name"
              label="First Name"
              required
              clearable
              prepend-icon="mdi-account"
              hint="(required)"
              persistent-hint
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="10" md="5" class="text-center pa-1"
            ><v-text-field
              v-model="last_name"
              label="Last Name"
              required
              clearable
              prepend-icon="mdi-account"
              hint="(required)"
              persistent-hint
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="10" md="5" class="text-center pa-1"
            ><v-text-field
              v-model="email"
              label="Email"
              clearable4
              prepend-icon="mdi-email"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="10" md="5" class="text-center pa-1"
            ><v-text-field
              v-model="phone"
              label="Telephone"
              clearable
              prepend-icon="mdi-phone"
              mask="###-###-####"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="10" md="5" class="text-center pa-1"
            ><v-text-field
              v-model="barcode"
              label="Barcode"
              clearable
              prepend-icon="mdi-barcode"
            ></v-text-field
          ></v-col>
          <v-col cols="12" sm="10" md="5" class="text-center pa-1"
            ><v-textarea
              v-model="notes"
              label="Notes"
              dense
              rows="2"
              clearable
              prepend-icon="mdi-note"
            ></v-textarea
          ></v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-tooltip color="primary" top>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn
              color="error"
              :disabled="!patronEditing"
              :loading="loading === 'delete'"
              text
              @click="deletePatron"
            >
              <v-icon color="error">mdi-trash-can</v-icon>

              DELETE</v-btn
            >
          </div>
        </template>
        <span>Delete patron</span>
      </v-tooltip>

      <v-spacer></v-spacer>
      <v-btn
        text
        :color="saveDisabled ? 'primary' : 'warning'"
        @click="$emit('close')"
        >{{ saveDisabled ? 'CLOSE' : 'CANCEL' }}</v-btn
      >
      <v-btn text color="success" @click="savePatron" :disabled="saveDisabled"
        >SAVE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import modalTitle from '../global/modalTitle.vue'
export default {
  components: { modalTitle },
  name: 'patronEdit',
  data: () => ({
    barcode: null,
    id: null,
    email: null,
    first_name: null,
    last_name: null,
    loading: null,
    notes: null,
    phone: null,
    originalData: {
      barcode: null,
      id: null,
      email: null,
      first_name: null,
      last_name: null,
      notes: null,
      phone: null
    }
  }),
  computed: {
    ...mapState({
      patronEditing: state => state.patronEditing,
      patrons: state => state.patrons
    }),
    fieldsRequired() {
      const required = ['first_name', 'last_name']
      const fields = []
      required.forEach(r => {
        if (!this[r]) {
          fields.push(r)
        }
      })
      return fields
    },
    isChanged() {
      let isChanged = false
      Object.keys(this.originalData).forEach(v => {
        if (this[v] && v !== 'id') {
          if (this.originalData[v] !== this[v].trim()) {
            isChanged = true
          }
        }
      })
      return isChanged
    },
    saveDisabled() {
      return !this.isChanged || this.fieldsRequired.length > 0
    }
    // valid() {
    //   let message = false
    //   if (!this.first_name) {
    //     message =
    //   }
    //   return this.first_name && this.last_name
    // }
  },
  methods: {
    deletePatron() {
      this.$emit('actionBtn', { action: 'delete', item: this.patronEditing })
    },
    savePatron() {
      const patronFields = [
        'barcode',
        'email',
        'first_name',
        'last_name',
        'notes',
        'phone'
      ]
      const patronData = patronFields.reduce((fields, curr) => {
        return { ...fields, [curr]: this?.[curr]?.trim() || '' }
      }, {})
      const isNew = this.id === null
      if (isNew) {
        patronData.id = new Date().getTime()
        this.$store.dispatch('setStateValue', {
          isPush: true,
          key: 'patrons',
          value: patronData
        })
        this.$emit('patronAdded', patronData)
        this.$emit('close')
      } else {
        patronData.id = this.id
        const pKey = this.patrons.findIndex(p => p.id == this.id)
        if (pKey > -1) {
          this.$store.dispatch('setStateValueByKey', {
            stateItem: 'patrons',
            key: pKey,
            value: patronData
          })
        }
        this.$emit('patronSaved', patronData)
        this.$emit('close')
      }
      this.setValues(patronData)
      this.$store.dispatch('setStateValue', {
        key: 'patronEditing',
        value: patronData
      })
      this.$store.dispatch('localStorageWrite', {
        key: 'patrons',
        data: this.patrons
      })
      this.$store.dispatch('toggleSnackbar', {
        status: 'success',
        message: `Patron ${isNew ? 'added' : 'saved'}.`
      })
    },
    setValues(newValues) {
      Object.keys(newValues).forEach(v => {
        if (this[v] !== undefined) {
          this[v] = newValues[v]
        }
        if (this.originalData[v] !== undefined) {
          this.originalData[v] = newValues[v]
        }
      })
    }
  },
  mounted() {
    if (this.patronEditing) {
      this.setValues(this.patronEditing)
    }
  }
}
</script>

<style></style>
