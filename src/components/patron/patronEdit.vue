<template>
  <v-card>
    <v-card-title class="headline primary--text justify-center"
      >EDIT PATRON</v-card-title
    >
    <v-card-text style="max-height: 600px;">
      <v-form ref="form">
        <v-row align="center" justify="space-around">
          <v-col cols="5"
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
          <v-col cols="5"
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
          <v-col cols="5"
            ><v-text-field
              v-model="email"
              label="Email"
              clearable
              prepend-icon="mdi-email"
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-text-field
              v-model="phone"
              label="Telephone"
              clearable
              prepend-icon="mdi-phone"
              mask="###-###-####"
            ></v-text-field
          ></v-col>
          <v-col cols="5"
            ><v-text-field
              v-model="barcode"
              label="Barcode"
              clearable
              prepend-icon="mdi-barcode"
            ></v-text-field
          ></v-col>
          <v-col cols="5"
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
      <v-btn text color="primary" disabled>RESET</v-btn>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="$emit('close')">CLOSE</v-btn>
      <v-btn text color="primary" @click="savePatron" :disabled="saveDisabled"
        >SAVE</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'patronEdit',
  data: () => ({
    barcode: null,
    id: null,
    email: null,
    first_name: null,
    last_name: null,
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
    savePatron() {
      //console.log('save patron method')
      const patronData = {
        id: this.id,
        barcode: this.barcode.trim() || this.barcode,
        email: this.email.trim() || this.email,
        first_name: this.first_name.trim() || this.first_name,
        last_name: this.last_name.trim() || this.last_name,
        notes: this.notes.trim() || this.notes,
        phone: this.phone.trim() || this.phone
      }
      this.$store
        .dispatch('apiCall', {
          endpoint: '/patron',
          postData: patronData
        })
        .then(res => {
          if (res.status) {
            if (res.status === 'success') {
              //dispatch snackbar
              this.$store.dispatch('setStateValue', {
                key: 'snackbarData',
                value: { status: res.status, message: res.message }
              })
              this.$store.dispatch('setStateValue', {
                key: 'snackbarState',
                value: true
              })
              if (this.id) {
                const pKey = this.patrons.findIndex(p => p.id == this.id)
                //console.log(pKey)
                //console.log(patronData)
                if (pKey > -1) {
                  this.$store.dispatch('setStateValueByKey', {
                    stateItem: 'patrons',
                    key: pKey,
                    value: patronData
                  })
                  this.setValues(patronData)
                }
              } else {
                patronData.id = res.data
                this.$store.dispatch('setStateValue', {
                  isPush: true,
                  key: 'patrons',
                  value: patronData
                })
                this.setValues(patronData)
                this.$emit('patronAdded', patronData)
              }
              //TODO: START HERE, SET PATRON AS SELECTED PATRON
              //CLOSE MODAL
            }
          }
        })
        .catch(err => {
          console.log(err)
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
